const { doQuery, doTransaction } = require("./helpers/queriesHelper");
const {
  acutalizar_stock_cristales_v2,
  obtener_stock_v2,
  obtener_stock_cristales_v2,
} = require("./StockCristales");
const {
  venta_insert_query,
  parse_venta_data,
  get_mp,
  query_items,
  query_mp,
  update_venta_query,
} = require("./queries/ventaQueries");

const { verificar_cantidades_productos_v2 } = require("./StockExt");
const {
  descontar_stock_recstock,
  descontar_stock_multilab,
  descontar_stock_monoflab,
} = require("../lib/global");

const ventas_mes_vendedor = (
  { mes, anio, idvendedor, idsucursal },
  callback,
) => {
  const query = `SELECT v.*, CONCAT(c.apellido,' ', c.nombre) AS 'cliente', c.dni, date_format(v.fecha_retiro, '%d-%m-%Y') AS 'fecha_retiro' FROM 
    venta v INNER JOIN 
    cliente c ON v.cliente_idcliente = c.idcliente
    WHERE 
    month(v.fecha_retiro) = ${mes} AND 
    YEAR(v.fecha_retiro) = ${anio} AND 
    v.usuario_idusuario = ${idvendedor} AND 
    v.estado='ENTREGADO' AND 
    (case when '${idsucursal}'<>'-1' then v.sucursal_idsucursal=${idsucursal} ELSE TRUE END)
    ;`;
  console.log("query ventas_mes_vendedor: ", query);
  doQuery(query, (res) => {
    if (!res || res.err) {
      console.log("error: ", err);
      callback(null);
      return;
    }
    //console.log(JSON.stringify(res));
    callback(res.data);
  });
};


const transaction_insert_venta = (data, callback) => {
  console.log("###################[Inserting venta]###################");
  console.log(
    "        _     __      _     \r\n       (_)___/ /   __(_)___ \r\n      / / __  / | / / / __ \\ \r\n     / / /_/ /| |/ / / /_/ /\r\n    /_/\\__,_/ |___/_/\\____/ \r\n                            ",
  );
  //console.log("                    0                        \r\n                     000      0              \r\n            000      00000    000            \r\n          0000000000 000000   0000           \r\n              00000000000000000000           \r\n              000000000000000000000   0      \r\n       000000000000000000000000000   0000    \r\n     00000000000000000000000000000000000     \r\n         000000000000000000000000000000      \r\n          00000000000000000000000000000      \r\n       0000000000000000000000000000000    0  \r\n     00000000000000000000000000000000000000  \r\n    00000000000000000000000000000000000000   \r\n   00   000000000000000000000000000000000    \r\n         00000000000000000000000000000       \r\n       0000000000000000000000000000000       \r\n       000000000000000000000000000000000000  \r\n       0000000000000000000000000000000000    \r\n       000  00000000000000000000000000       \r\n       0    000000000000000000000            \r\n             000000000000  00000000          \r\n             0000   00000   00000000         \r\n              000    0000                    \r\n                        00                   ");

  const __now = new Date();

  if (data.fechaRetiro == null) {
    data.fechaRetiro = `${__now.getDate()}-${__now.getMonth()}-${__now.getFullYear()}`;
  }

  const { arrayQttiesCristales, elementsArrCristales } =
    get_quantities_arrays(data); //prepare quantities

  const __logic = async (connection) => {
    if (data.edicion) {
      console.log(
        "Edicion de venta. Eliminando items y mp de venta id: " + data.idventa,
      );
      //to do: cristales stock restoration for edited venta...
      await inc_cantidades_stock_venta_v2(data, connection);

      await connection.query(
        `DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.venta_idventa=${data.idventa};`,
      );

      await connection.query(
        `DELETE FROM venta_has_stock vhs WHERE vhs.venta_idventa=${data.idventa};`,
      );
    }

    const resp_data_stock_cristales = await obtener_stock_cristales_v2(
      { codigos: arrayQttiesCristales, fk_sucursal: data.fksucursal },
      connection,
    );

    if (!resp_data_stock_cristales?.error) {
      const stock_check = compare_requested_with_db_response(
        resp_data_stock_cristales.data,
        arrayQttiesCristales,
      );

      if (stock_check) {
        if (stock_check.some((r) => !r.stockSuficiente)) {
          console.log("Stock verification failed for cristales...");
          return {
            error:
              "No hay suficiente stock de cristales para completar la venta",
            details: stock_check.filter((r) => !r.stockSuficiente),
            arrayQttiesCristales,
            elementsArrCristales,
          };
        }
      }
    }

    const resp_data_stock = await verificar_cantidades_productos_v2(
      { data, ignore_cristales: false },
      connection,
    );

    console.log("Stock verification passed. Adding venta...");

    let insert_data_id = -1;

    if (data.edicion) {
      console.log("Edicion de venta. Actualizando venta id: " + data.idventa);

      insert_data_id = data.idventa;

      const result_update_venta = await connection.query(
        update_venta_query(venta_queries.parse_venta_data(data), data.idventa),
      );
    } else {
      const venta_insert_response = await connection.query(
        venta_insert_query(parse_venta_data(data), data.fkcaja),
      );
      insert_data_id = venta_insert_response[0].insertId;
    }

    console.log("Venta insert id: " + insert_data_id);

    const extra_queries = prepare_ventaitems_and_mp(insert_data_id, data);

    for (const q of extra_queries) {
      await connection.query(q);
    }

    const debeDescontarCristales =
      (+data.tipo == 2 && descontar_stock_recstock) ||
      (+data.tipo == 5 && descontar_stock_multilab) ||
      (+data.tipo == 4 && descontar_stock_monoflab);

    console.log("Debe descontar cristales: ", debeDescontarCristales);

    if (debeDescontarCristales) {
      const sucursal_detalle = await connection.query(
        `select s.fk_sucursal_cristales from sucursal s where s.idsucursal = ${data.fksucursal};`,
      );

      const _id_sucursal_cristales =
        sucursal_detalle[0][0].fk_sucursal_cristales;

      for (const record of arrayQttiesCristales) {
        await acutalizar_stock_cristales_v2(
          { ...record, fksucursal: _id_sucursal_cristales },
          connection,
        );
      }
    } else {
      console.log("No se descontará stock de cristales para esta venta.");
    }

    //descontar stock
    const stock_desc_response = await desc_cantidades_stock_venta_v2(
      { idventa: insert_data_id, idsucursal: data.fksucursal },
      connection,
    );
    console.log(
      "###################[Inserting venta - The End...]###################",
    );
    return { insert_data_id };
  };

  doTransaction(__logic, ({ data, error }) => {
    if (error) {
      return callback({ error: 1, msg: error });
    }
    return callback({
      ok: 1,
      msg: "Venta agregada correctamente",
      idventa: data.insert_data_id,
    });
  });
};

const prepare_ventaitems_and_mp = (venta_id, data) => {
  var _arr_items = [];

  const do_push = (orden, arr, val, tipo, descontable) =>
    (val || 0) === 0
      ? arr
      : val.codigo == null || val.idcodigo < 0
        ? arr
        : [
            ...arr,
            { ...val, tipo: tipo, orden: orden, descontable: descontable },
          ];

  const get_query_str = (items) => {
    var _str = "";
    items.forEach((e) => {
      _str +=
        (_str.length > 0 ? "," : "") +
        `(
            ${venta_id},
            '${data.fksucursal}', 
            ${e.idcodigo},
            ${e.cantidad},
            '${e.tipo}',
            ${e.precio},
            ${typeof e.total === "undefined" ? e.precio : e.total}, 
            '${typeof e.esf === "undefined" ? 0 : e.esf}', 
            '${typeof e.cil === "undefined" ? 0 : e.cil}', 
            '${typeof e.eje === "undefined" ? 0 : e.eje}',
            ${typeof e.orden === "undefined" ? 0 : e.orden},
            ${typeof e.descontable === "undefined" ? 1 : e.descontable},
            '${typeof e.cb === "undefined" ? 0 : e.cb}',
            '${typeof e.diametro === "undefined" ? 0 : e.diametro}'
            )`;
    });
    return _str;
  };

  const prepare_venta_directa_items = (__data) => {
    _arr_items = __data.productos;
  };

  const prepare_lclab_items = (__data) => {
    _arr_items = do_push(1, _arr_items, __data.productos.oi, "oi", 1);
    _arr_items = do_push(0, _arr_items, __data.productos.od, "od", 1);
    _arr_items = do_push(2, _arr_items, __data.productos.insumo, "insumo", 1);
  };

  const prepare_lclstock_items = (__data) => {
    _arr_items = do_push(1, _arr_items, __data.productos.oi, "oi", 1);
    _arr_items = do_push(0, _arr_items, __data.productos.od, "od", 1);
    _arr_items = do_push(2, _arr_items, __data.productos.insumo, "insumo", 1);
  };

  const prepare_monoflab_items = (__data) => {
    _arr_items = do_push(
      2,
      _arr_items,
      __data.productos.lejos_armazon,
      "lejos_armazon",
      1,
    );
    _arr_items = do_push(
      0,
      _arr_items,
      __data.productos.lejos_od,
      "lejos_od",
      1,
    );
    _arr_items = do_push(
      1,
      _arr_items,
      __data.productos.lejos_oi,
      "lejos_oi",
      1,
    );
    _arr_items = do_push(
      3,
      _arr_items,
      __data.productos.lejos_tratamiento,
      "lejos_tratamiento",
      1,
    );
    _arr_items = do_push(
      6,
      _arr_items,
      __data.productos.cerca_armazon,
      "cerca_armazon",
      1,
    );
    _arr_items = do_push(
      4,
      _arr_items,
      __data.productos.cerca_od,
      "cerca_od",
      1,
    );
    _arr_items = do_push(
      5,
      _arr_items,
      __data.productos.cerca_oi,
      "cerca_oi",
      1,
    );
    _arr_items = do_push(
      7,
      _arr_items,
      __data.productos.cerca_tratamiento,
      "cerca_tratamiento",
      1,
    );
  };

  const prepare_multiflab_items = (__data) => {
    _arr_items = do_push(2, _arr_items, __data.productos.armazon, "armazon", 1);
    _arr_items = do_push(0, _arr_items, __data.productos.od, "od", 1);
    _arr_items = do_push(1, _arr_items, __data.productos.oi, "oi", 1);
    _arr_items = do_push(
      3,
      _arr_items,
      __data.productos.tratamiento,
      "tratamiento",
      1,
    );
  };

  const prepare_recstock_items = (__data) => {
    _arr_items = do_push(
      2,
      _arr_items,
      __data.productos.lejos_armazon,
      "lejos_armazon",
      1,
    );
    _arr_items = do_push(
      0,
      _arr_items,
      __data.productos.lejos_od,
      "lejos_od",
      1,
    );
    _arr_items = do_push(
      1,
      _arr_items,
      __data.productos.lejos_oi,
      "lejos_oi",
      1,
    );
    _arr_items = do_push(
      3,
      _arr_items,
      __data.productos.lejos_tratamiento,
      "lejos_tratamiento",
      1,
    );

    _arr_items = do_push(
      6,
      _arr_items,
      __data.productos.cerca_armazon,
      "cerca_armazon",
      1,
    );
    _arr_items = do_push(
      4,
      _arr_items,
      __data.productos.cerca_od,
      "cerca_od",
      1,
    );
    _arr_items = do_push(
      5,
      _arr_items,
      __data.productos.cerca_oi,
      "cerca_oi",
      1,
    );
    _arr_items = do_push(
      7,
      _arr_items,
      __data.productos.cerca_tratamiento,
      "cerca_tratamiento",
      1,
    );
  };

  switch (+data.tipo) {
    case 1:
      prepare_venta_directa_items(data);
      break;
    case 2:
      prepare_recstock_items(data);
      break;
    case 3:
      prepare_lclstock_items(data);
      break;
    case 4:
      prepare_monoflab_items(data);
      break;
    case 5:
      prepare_multiflab_items(data);
      break;
    case 6:
      prepare_lclab_items(data);
      break;
  }

  //venta_id = parseInt(resp.insertId);
  var mp = "";
  get_mp(data, venta_id).forEach((p) => {
    mp +=
      (mp.length > 0 ? "," : "") +
      `(
          ${venta_id},
          ${p.modo_pago_idmodo_pago},
          ${p.banco_idbanco},
          ${p.mutual_idmutual},
          ${p.monto},
          ${p.monto_int},
          ${p.cant_cuotas},
          ${p.monto_cuota},
          ${p.fk_tarjeta},
          '${p.modo_pago}',
          '${p.tarjeta_nro}',
          ${p.fk_banco_transferencia}
          )`;
  });

  var _items_data = get_query_str(_arr_items);

  const _queries = [];
  if (mp.length > 0) {
    _queries.push(query_mp + mp);
  }
  if (_arr_items.length > 0) {
    _queries.push(query_items + _items_data);
  }

  return _queries;
};

const get_quantities_arrays = (data) => {
  const addToArray = (parentObj, field, arr) =>
    parentObj[field] && parentObj[field]?.idcodigo > 0
      ? [...arr, parentObj[field]]
      : arr;

  const updateCodeQttyArray = (obj, _array) =>
    _array.find(
      (record) =>
        record.idcodigo == obj.idcodigo &&
        record.esf == obj.esf &&
        record.cil == obj.cil,
    )
      ? _array.map((_record) =>
          _record.idcodigo == obj.idcodigo &&
          _record.esf == obj.esf &&
          _record.cil == obj.cil
            ? { ..._record, cantidad: +_record.cantidad + +obj.cantidad }
            : _record,
        )
      : [
          ..._array,
          {
            idcodigo: obj.idcodigo,
            esf: obj.esf,
            cil: obj.cil,
            cantidad: obj.cantidad,
          },
        ];

  let arrayQttiesCristales = [];
  let elementsArrCristales = [];
  elementsArrCristales = addToArray(
    data.productos,
    "lejos_od",
    elementsArrCristales,
  );
  elementsArrCristales = addToArray(
    data.productos,
    "lejos_oi",
    elementsArrCristales,
  );
  elementsArrCristales = addToArray(
    data.productos,
    "cerca_oi",
    elementsArrCristales,
  );
  elementsArrCristales = addToArray(
    data.productos,
    "cerca_od",
    elementsArrCristales,
  );

  elementsArrCristales.forEach((element) => {
    arrayQttiesCristales = updateCodeQttyArray(element, arrayQttiesCristales);
  });

  return { arrayQttiesCristales, elementsArrCristales };
};

//compare requested quantities with stock quantities
const compare_requested_with_db_response = (dbResponseArr, reqQtties) => {
  console.log("Comparing requested quantities with database response...");
  console.log("Database response: ", JSON.stringify(dbResponseArr));
  console.log("Requested quantities: ", JSON.stringify(reqQtties));
  const responseWithQtty = dbResponseArr.map((stockRecord) => {
    const requestedQtty = reqQtties.find(
      (requested) =>
        requested.idcodigo === stockRecord.fk_codigo &&
        requested.esf === stockRecord.esf &&
        requested.cil === stockRecord.cil,
    );

    const response = {
      ...stockRecord,
      requestedCantidad: requestedQtty ? requestedQtty.cantidad : 0,
      stockSuficiente: requestedQtty
        ? stockRecord.cantidad >= requestedQtty.cantidad
        : true,
    };

    console.log(
      `Stock record for codigo ${stockRecord.fk_codigo}, esf ${stockRecord.esf}, cil ${stockRecord.cil}:`,
    );
    console.log(`- Stock cantidad: ${stockRecord.cantidad}`);
    console.log(`- Requested cantidad: ${response.requestedCantidad}`);
    console.log(
      `- Stock suficiente: ${response.stockSuficiente ? "Sí" : "No"}`,
    );

    return response;
  });
  return responseWithQtty;
};

const desc_cantidades_stock_venta_v2 = async (data, connection) => {
  console.log("Descontando stock de venta id: " + data.idventa);

  const query = `update stock s,
    (
            SELECT 
                vhs.stock_codigo_idcodigo AS 'idcodigo', 
                sum(vhs.cantidad) AS 'cantidad' 
            FROM venta_has_stock vhs 
                  WHERE vhs.venta_idventa= ${data.idventa} 
                  AND vhs.descontable=1
                  GROUP BY vhs.stock_codigo_idcodigo
    ) AS vs
    SET s.cantidad = s.cantidad - vs.cantidad
    where
    vs.idcodigo = s.codigo_idcodigo AND 
    s.sucursal_idsucursal=${data.idsucursal}
    ;`;

  return await connection.query(query);
};

const inc_cantidades_stock_venta_v2 = async (data, connection) => {
  const response = await connection.query(
    `SELECT v.estado, v.idventa, v.sucursal_idsucursal from venta v WHERE v.idventa = ${data.idventa};`,
  );

  const rep = response[0];

  const id_sucursal = rep[0].sucursal_idsucursal;

  const query = `update stock s,
        (
                SELECT 
                    vhs.stock_codigo_idcodigo AS 'idcodigo', 
                    sum(vhs.cantidad) AS 'cantidad' 
                FROM venta_has_stock vhs 
                      WHERE vhs.venta_idventa= ${data.idventa} 
                      AND vhs.descontable=1
                      GROUP BY vhs.stock_codigo_idcodigo
        ) AS vs
        SET s.cantidad = s.cantidad + vs.cantidad
        where
        vs.idcodigo = s.codigo_idcodigo AND 
        s.sucursal_idsucursal=${id_sucursal}`;

  console.log(query);

  return await connection.query(query);
};

module.exports = {
  ventas_mes_vendedor,
  transaction_insert_venta,
};
