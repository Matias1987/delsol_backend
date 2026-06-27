const { escapeHelper } = require("../helpers/queriesHelper");

const queriesTM = {
    queryVenta: (data) => `INSERT INTO venta 
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
    estado,
    en_laboratorio
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
    '7',
    ${data.montoTotal},
    ${data.montoTotal},
    '',
    '',
    '',
    'PENDIENTE',
    1
  );`,

  queryInsertTrabajo: (data, idventa) => `INSERT INTO trabajo (
  idventa, 
  nro_trabajo, 
  tipo_trabajo,
  comentarios
  ) 
  VALUES (${idventa}, '${data.nro}', '${data.tipo}', ${escapeHelper(data.comentarios)});`,

  queryVentaStock: (data, idVenta, idsucursal, idTrabajo) =>{
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
    id_trabajo,
    id_descuento,
    id_trabajo_realizado
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
        ${idTrabajo},
        ${item.iddescuento},
        ${item.iddisenio ? item.iddisenio : "NULL"})
        ${index < data.items.length - 1 ? "," : ""}`;
    });
  return  query + rows;
}

}

module.exports = {queriesTM}