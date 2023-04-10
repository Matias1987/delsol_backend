const mysql_connection = require("../lib/mysql_connection")

const obtener_facturas = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("SELECT * FROM factura;",(err,rows)=>{
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

module.exports = {
    obtener_facturas,
    agregar_factura
}