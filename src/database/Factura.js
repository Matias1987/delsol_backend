const mysql_connection = require("../lib/mysql_connection")



const obtener_facturas = (idprov,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`SELECT f.*, p.nombre AS 'proveedor',  date_format(f.fecha,'%d-%m-%y') as 'fecha_formated' 
    FROM factura f, proveedor p 
    WHERE f.proveedor_idproveedor = p.idproveedor AND 
    (case when '-1'<>'${idprov}' then f.proveedor_idproveedor = ${idprov} else true end)
    ;`,(err,rows)=>{
        callback(rows)
    })
    connection.end();
}

const agregar_factura = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        `INSERT INTO factura (numero, proveedor_idproveedor, monto, cantidad) VALUES ('${data.numero}', ${data.proveedor_idproveedor},${data.monto},${data.cantidad});`,(err,result)=>{
        callback(result.insertId)
    })
    connection.end();
}

const detalle_factura = (data, callback) => {
    const  connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`SELECT 
    DATE_FORMAT(f.fecha, '%d-%m-%y') AS 'fecha',
    f.numero,
    f.cantidad,
    f.monto,
    f.proveedor_idproveedor,
    p.nombre as 'proveedor'
    FROM 
    factura f, 
    proveedor p 
    WHERE p.idproveedor = f.proveedor_idproveedor AND f.idfactura = ${data};`,(err,rows)=>{
        callback(rows)
    });
    connection.end();
}

const lista_elementos_factura = (data, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`SELECT 
    c.codigo,
    cf.cantidad,
    cf.costo
     FROM codigo_factura cf, codigo c WHERE
    cf.stock_codigo_idcodigo = c.idcodigo AND
    cf.factura_idfactura=${data};`, (err,rows)=>{
        callback(rows)
    })
    connection.end();
}

module.exports = {
    obtener_facturas,
    agregar_factura,
    detalle_factura,
    lista_elementos_factura,
}