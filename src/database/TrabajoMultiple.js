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

    if (!id) {
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

    return callback(response.data);
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
  INSERT INTO venta_has_stock vhs (
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

  return callback({ ok: 1 }); //for testing

  doQuery(query, (response) => {
    if (!response) {
      return callback({ error });
    }
  });
};

module.exports = {
  agregarVenta,
  checkQuantities,
  descontarStock,
  agregarTrabajo,
  agregarTabajoItems,
};
