const { doQuery } = require("./helpers/queriesHelper");

const agregarVenta = (data, callback) => {
  const queryVenta = `INSERT INTO venta 
  (
    cliente_idcliente, 
    sucursal_idsucursal, 
    caja_idcaja, 
    usuario_idusuario, 
    medico_idmedico, 
    monto_total, 
    descuento, 
    subtotal, 
    comentarios, 
    fecha_retiro,
    fk_destinatario,
    fk_os,
    tipo,
    debe,
    saldo,
    hora_retiro,
    json_items,
    uid,
    estado
  ) 
  VALUES (
    '${data.idcliente}', 
    '${data.idsucursal}', 
    ${data.idcaja}, 
    ${data.idusuario}, 
    NULL, 
    '${data.montoTotal}', 
    '${data.descuento}', 
    '${data.monto}', 
    '${data.comentarios}', 
    date('${data.fechaRetiro}'),
    NULL,
    NULL,
    'MULTIPLE',
    ${data.montoTotal},
    ${data.montoTotal},
    '',
    '',
    '',
    ''
  );`;

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
  const query = `INSERT INTO trabajo (
  idventa, 
  nro_trabajo, 
  tipo_trabajo) 
  VALUES (${idventa}, '${data.nro}', '${data.tipo}');`;
  console.log("query agregar trabajo: ", query);
  //return callback({ idtrabajo: 1 }); //for testing
  doQuery(query, (response) => {
    if (!response) {
      return callback({ error });
    }

    return callback({idtrabajo: response.data.insertId});
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
  console.log("agregando trabajo items para trabajo:", idTrabajo);

  console.log(data.items);

  let query = `
  INSERT INTO venta_has_stock (
  venta_idventa, 
  stock_sucursal_idsucursal, 
  stock_codigo_idcodigo, 
  cantidad, 
  tipo, 
  esf, 
  cil, 
  eje,
  precio,
  total, 
  id_trabajo
  )VALUES`;
  let rows = "";

  data.items.forEach((item, index) => {
    rows += `(
    ${idVenta}, 
    ${idsucursal}, 
    ${item.idcodigo}, 
    ${item.cantidad}, 
    '${item.tipo}', 
    '${item.esf}', 
    '${item.cil}', 
    '${item.eje}', 
    '${item.precio}', 
    '${item.precio * item.cantidad}', 
    ${idTrabajo})
    ${index < data.items.length - 1 ? "," : ""}`;
  });

  query += rows;
  console.log("query agregar trabajo items: ", query);

  //return callback({ ok: 1 }); //for testing

  doQuery(query, (response) => {
    if (!response) {
      return callback({ error });
    }
    return callback({ ok: 1 });
  });
};

const obtenerTrabajoMultiple = ({ idventa }, callback) => {
  console.log("obteniendo trabajo multiple para idventa: ", idventa);
  const query_venta = `SELECT * FROM venta v WHERE v.idventa=${idventa};`;
  const query_trabajos = `SELECT 
                        t.idtrabajo,
                        t.nro_trabajo,
                        t.tipo_trabajo,
                        t.idventa,
                        vhs.stock_codigo_idcodigo,
                        vhs.tipo,
                        vhs.esf,
                        vhs.cil,
                        vhs.eje,
                        vhs.cantidad,
                        vhs.precio,
                        vhs.total 
                        FROM 
                        trabajo t 
                        INNER JOIN 
                        venta_has_stock vhs
                        ON vhs.id_trabajo= t.idtrabajo
                        WHERE 
                        t.idventa=${idventa};`;

                        console.log(query_trabajos);

  doQuery(query_venta, (responseVenta) => {
    if (!responseVenta) {
      return callback({ error: 1, msg: "error fetching venta" });
    }
    doQuery(query_trabajos, (responseTrabajos) => {
      if (!responseTrabajos) {
        
        return callback({ error: 1, msg: "error fetching trabajos" });
      }
      console.log(responseTrabajos)

      return callback({ ok: 1, venta: responseVenta.data, trabajos: responseTrabajos.data });
    });
  });
};

module.exports = {
  agregarVenta,
  checkQuantities,
  descontarStock,
  agregarTrabajo,
  agregarTabajoItems,
  obtenerTrabajoMultiple
};
