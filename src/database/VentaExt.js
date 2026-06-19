const { doQuery } = require("./helpers/queriesHelper");
const { venta_insert_query, parse_venta_data, get_mp, query_items, query_mp } = require("./queries/ventaQueries");

const ventas_mes_vendedor = ({mes, anio, idvendedor, idsucursal}, callback) => {
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

const do_insert_venta_V2 = (data, callback) => {
  const __now = new Date();

  if (data.fechaRetiro == null) {
    data.fechaRetiro = `${__now.getDate()}-${__now.getMonth()}-${__now.getFullYear()}`;
  }

  if (data.edicion) {
    //TO DO
    //doQuery(venta_queries.update_venta_query(venta_queries.parse_venta_data(data),data.idventa),(response)=>{
      //save_ventaitems_and_mp({insertId: data.idventa},data, callback);
    //})
  }
  else {
    const __logic = async (connection) => {
      const venta_insert_response = await connection.query(venta_insert_query(
            parse_venta_data(data),
            idcaja,
          ));
      const insert_data_id = venta_insert_response[0][0].insertId;

      const extra_queries = prepare_ventaitems_and_mp(insert_data_id,data);

      for(const q of extra_queries){
        await connection.query(q);
      }
      //descontar stock

      //guardar pago

      
      return {insert_data_id};
    }

    doTransaction(__logic,({data,error})=>{
      if(error){
        return callback({error:1, msg:error});
      }
      return callback(data.insert_data_id)
    })
  }
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
  if(mp.length>0)
  {
    _queries.push(query_mp + mp);
  }
  if(_arr_items.length>0)
  {
    _queries.push(query_items + _items_data);
  }

  return _queries;

}
module.exports = {
  ventas_mes_vendedor,
};
