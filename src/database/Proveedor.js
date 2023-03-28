const mysql_connection = require("../lib/mysql_connection")

const agregar_proveedor = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect()
    connection.query("INSERT INTO `proveedor` (`cuit`, `nombre`) VALUES ('"+data.cuit+"', '"+data.nombre+"');",(err,result,fields)=>{
        callback(result.insertId)
    })
    connection.end();
}

const obtener_proveedores = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("SELECT * FROM proveedor p;",(err,rows,fields)=>{
        callback(rows)
    })
    connection.end();
}

module.exports = {
    agregar_proveedor,obtener_proveedores,
}