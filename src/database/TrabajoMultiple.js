const {
  doQuery,
  doTransaction,
  escapeHelper,
} = require("./helpers/queriesHelper");
const { queriesTM } = require("./queries/TrabajoMultipleQueries");

const agregarVenta = (data, callback) => {
  //parse data...

  //console.log(data)
  const query = queriesTM.queryVenta(data);

  console.log("query agregar venta: ", queryVenta);
  //return callback({ insertId: 1 }); //for testing

  doQuery(queryVenta, (respone) => {
    const idventa = respone?.data?.insertId;

    if (!idventa) {
      return callback({ error });
    }
    return callback({ idventa });
  });
};

const agregarTrabajo = (data, idventa, callback) => {
  const query = queriesTM.queryInsertTrabajo(data, idventa);
  console.log("query agregar trabajo: ", query);
  //return callback({ idtrabajo: 1 }); //for testing
  doQuery(query, (response) => {
    if (!response) {
      return callback({ error });
    }

    return callback({ idtrabajo: response.data.insertId });
  });
};

const checkQuantities = (data, idsucursal, callback) => {
  const query = ``;
  doQuery(query, (response) => {
    if (!response) {
      return callback({ error });
    }

    return callback(response.data);
  });
};

const descontarStock = (idventa, idsucursal, callback) => {
  const query = ``;
  doQuery(query, (response) => {
    if (!response) {
      return callback({ error });
    }

    return callback(response.data);
  });
};

const agregarTabajoItems = (data, idTrabajo, idVenta, idsucursal, callback) => {
  const query = queriesTM.queryVentaStock(data, idVenta, idsucursal, idTrabajo);

  console.log("***** -> query agregar trabajo items: ", query);
  //return callback({ ok: 1 }); //for testing

  doQuery(query, (response) => {
    if (!response) {
      return callback({ error });
    }
    return callback({ ok: 1 });
  });
};

const obtenerTrabajoMultiple = ({ idventa }, callback) => {
  //console.log("obteniendo trabajo multiple para idventa: ", idventa);
  const query_venta = `SELECT v.*, c.nombre as 'cliente', date_format(v.fecha, '%d-%m-%Y') as 'fecha_f' FROM venta v inner join cliente c on v.cliente_idcliente = c.idcliente WHERE v.idventa=${idventa};`;
  const query_trabajos = `SELECT 
                        t.idtrabajo,
                        t.nro_trabajo,
                        t.tipo_trabajo,
                        t.idventa,
                        t.comentarios,
                        vhs.stock_codigo_idcodigo,
                        vhs.codigo,
                        vhs.descripcion,
                        vhs.tipo,
                        vhs.esf,
                        vhs.cil,
                        vhs.eje,
                        vhs.ad,
                        vhs.cantidad,
                        vhs.precio,
                        vhs.total,
                        vhs.id_descuento,
                        vhs.id_trabajo_realizado,
                        vhs.detalle_trabajo
                        FROM 
                        trabajo t 
                        INNER JOIN 
                        (
								SELECT 
								_vhs.*, 
								c.codigo, 
								c.descripcion ,
								if(_vhs.id_trabajo_realizado IS NULL, '', sg.nombre_corto) AS 'detalle_trabajo'
								FROM venta_has_stock _vhs 
								INNER JOIN codigo c ON _vhs.stock_codigo_idcodigo = c.idcodigo
								LEFT JOIN subgrupo sg ON _vhs.id_trabajo_realizado = sg.idsubgrupo
								 WHERE  _vhs.venta_idventa=${idventa}
								) vhs
                        ON vhs.id_trabajo= t.idtrabajo
                        WHERE 
                        t.idventa=${idventa};
                        `;

  console.log(query_trabajos);

  doQuery(query_venta, (responseVenta) => {
    if (!responseVenta) {
      return callback({ error: 1, msg: "error fetching venta" });
    }
    doQuery(query_trabajos, (responseTrabajos) => {
      if (!responseTrabajos) {
        return callback({ error: 1, msg: "error fetching trabajos" });
      }
      //console.log(responseTrabajos)

      return callback({
        ok: 1,
        venta: responseVenta.data[0],
        trabajos: responseTrabajos.data,
      });
    });
  });
};

const procesar_ventas = (rows) => {
  if (!rows) {
    return rows;
  }
  const result = [];
  let lastId = -1;
  let parent = null;
  let key = 0;
  rows.forEach((row) => {
    if (+lastId != +row.idventa) {
      parent = null;
      if (+row.tipo == 7 && +row.idtrabajo < 0) {
        return;
      }

      if (+row.tipo == 7) {
        parent = { ...row, isParent: 1, key: key, children: [] };
        result.push(parent);
        key++;
      }
    }
    const childNode = { ...row, isParent: 0, key: key };

    if (parent) {
      parent.children.push(childNode);
    } else {
      result.push(childNode);
    }

    lastId = row.idventa;
    key++;
  });
  return result;
};

const obtenerListadoVentasTM = (idsucursal, callback) => {
  const query = `SELECT 
                  v.idventa, 
                  CONCAT(c.apellido,', ',c.nombre) AS 'cliente',
                  u.nombre AS 'vendedor',
                  v.estado,
                  v.tipo,
                  v.monto_total as 'monto',
                  date_format(v.fecha, '%d-%m-%y') AS 'fecha',
                  DATE_FORMAT(v.fecha_retiro, '%d-m%-%y') AS 'fecha_retiro',
                  v.sucursal_idsucursal,
                  v.cliente_idcliente,
                  v.en_laboratorio,
                  s.nombre as 'sucursal',
                  if(v.en_laboratorio=1, if(v.estado_taller='LAB', 'LABORATORIO', v.estado_taller) , 'SUCURSAL') as 'estado_taller',
                  if(tt.idventa is NULL,-1 , tt.idtrabajo) as 'idtrabajo',
                    if(tt.idventa is NULL, '' , tt.tipo_trabajo) as 'tipo_trabajo',
                    if(tt.idventa is NULL, '' , if(tt.estado='LAB', 'LABORATORIO', tt.estado)) as 'estado_trabajo'
                  FROM 
                  venta v LEFT JOIN trabajo tt ON tt.idventa = v.idventa, 
                  cliente c, 
                  usuario u, 
                  sucursal s,
                    caja ca 
                  WHERE 
                  v.caja_idcaja = ca.idcaja AND 
                  s.idsucursal = v.sucursal_idsucursal AND 
                  v.cliente_idcliente = c.idcliente AND
                  v.usuario_idusuario = u.idusuario AND
                  v.tipo=7 AND 
                  (case when '${idsucursal}'<>'' then v.sucursal_idsucursal = '${idsucursal}' else true end)
                  order by v.idventa desc; `;

  doQuery(query, (response) => {
    if (!response) {
      return callback({ error: 1, msg: "error fetching ventas" });
    }
    return callback({ ok: 1, data: procesar_ventas(response.data) });
  });
};

const obtenerItemsTrabajo = (idtrabajo, callback) => {
  const query = `SELECT 
                  vhs.stock_codigo_idcodigo,
                  vhs.tipo,
                  vhs.esf,
                  vhs.cil,
                  vhs.eje,
                  vhs.ad,
                  vhs.cantidad,
                  vhs.precio,
                  vhs.total
                  FROM venta_has_stock vhs
                  WHERE vhs.id_trabajo = ${idtrabajo}`;

  console.log("query obtener items trabajo: ", query);

  doQuery(query, (response) => {
    if (!response) {
      return callback({ error: 1, msg: "error fetching items" });
    }
    return callback({ ok: 1, data: response.data });
  });
};

const marcar_entregado = ({ idventa }, callback) => {
  const __logic = async (connection) => {
    const get_venta_query = `select * from venta v where v.idventa=${idventa};`;

    //console.log(JSON.stringify(get_venta_query));

    const response_venta = await connection.query(get_venta_query);

    //console.log(JSON.stringify(response_venta));

    const data = response_venta[0][0];

    //console.log(JSON.stringify(response_venta[0]))

    const monto_venta = parseFloat(data.monto_total);
    const monto_cuota = parseFloat(data.monto_total);
    const cant_cuotas = 1;
    const monto_int = parseFloat(data.monto_total);

    const query_update = `update venta v set v.estado='ENTREGADO' where v.idventa=${idventa}`;

    const response_update = await connection.query(query_update);

    //console.log(`monto_int: ${monto_int}`);

    if (parseFloat(monto_int) < 1) {
      return { ok: 1 };
    }

    const insert_query = `insert into venta_has_modo_pago (venta_idventa, monto, monto_int, cant_cuotas, monto_cuota, modo_pago) values (${idventa}, '${monto_venta}','${monto_int}','${cant_cuotas}','${monto_cuota}','ctacte');`;

    const response_insert = await connection.query(insert_query);

    return { ok: 1 };
  };

  doTransaction(__logic, ({ data, err }) => {
    if (err) {
      console.error("Error en la transacción. Rollback aplicado:", err);
      return { error: 1 };
    }
    console.log("OK...");
    return callback({ ok: 1 });
  });
};

const transaccionAgregarTM = async (data, callback) => {
  const _logic = async (connection) => {
    console.log("Begin Transaction...");
    const venta_insert_response = await connection.query(
      queriesTM.queryVenta(data),
    );

    console.log(
      "venta insert response: " + JSON.stringify(venta_insert_response[0]),
    );

    const idventa = venta_insert_response[0].insertId;

    for (let i = 0; i < data.trabajos.length; i++) {
      const trabajo = data.trabajos[i];
      const trabajo_insert_response = await connection.query(
        queriesTM.queryInsertTrabajo(trabajo, idventa),
      );

      console.log(
        "->trabajo insert response: " +
          JSON.stringify(venta_insert_response[0]),
      );

      const idtrabajo = trabajo_insert_response[0].insertId;
      //console.log(queriesTM.queryVentaStock(trabajo, idventa, data.idsucursal, idtrabajo));
      const item_insert_response = await connection.query(
        queriesTM.queryVentaStock(trabajo, idventa, data.idsucursal, idtrabajo),
      );
    }
  };

  doTransaction(_logic, ({ data, err }) => {
    if (err) {
      console.error("Error en la transacción. Rollback aplicado:", err);
      return { error: 1 };
    }
    console.log("OK...");
    return callback({ ok: 1 });
  });
};

module.exports = {
  agregarVenta,
  checkQuantities,
  descontarStock,
  agregarTrabajo,
  agregarTabajoItems,
  obtenerTrabajoMultiple,
  obtenerListadoVentasTM,
  obtenerItemsTrabajo,
  marcar_entregado,
  transaccionAgregarTM,
};
