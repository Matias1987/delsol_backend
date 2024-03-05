const mysql_connection = require("../lib/mysql_connection")

const agregar_item_adicional = (data, callback) => {
    let query = `INSERT INTO sobre_adicionales (fk_sucursal, fk_codigo, fk_venta, cantidad, tipo) VALUES (${data.fksucursal}, ${data.fkcodigo}, ${data.fkventa}, ${data.cantidad}, '${data.tipo}');`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const obtener_adicionales_venta = (data, callback) => {
    let query = `SELECT items.tipo, items.idcodigo, items.original , c.codigo
    FROM 
    codigo c,
    (
    SELECT vs.stock_codigo_idcodigo AS 'idcodigo', 1 AS 'original', vs.tipo AS 'tipo'  FROM venta_has_stock vs WHERE vs.venta_idventa=${data}
    union
    SELECT sa.fk_codigo AS 'idcodigo', 0 AS 'original', sa.tipo AS 'tipo' FROM sobre_adicionales sa WHERE sa.fk_venta=${data}
    ) AS items
    WHERE c.idcodigo = items.idcodigo
    ORDER BY items.tipo, items.original desc`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

module.exports = {agregar_item_adicional, obtener_adicionales_venta}