const mysql_connection = require("../lib/mysql_connection")

const agregar_transferencia = (data,callback) => {
    const query = `INSERT INTO transferencia (fk_destino, fk_origen, fk_caja, monto, comentarios) 
                    VALUES (${data.fkdestino}, ${data.fkorigen}, ${data.fkcaja}, ${data.monto}, '${data.comentarios}');`
    console.log(query)
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(query,(err,rows,fields)=>{
        callback(rows);
    })
    connection.end();
}

const obtener_transferencias_enviadas = (idsucursal, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`SELECT t.*, s.nombre AS 'sucursal_destino' 
    FROM transferencia t, sucursal s WHERE t.fk_origen = ${idsucursal} AND t.fk_destino = s.idsucursal;`,(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}
const obtener_transferencias_recibidas = (idsucursal, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`SELECT t.*, s.nombre AS 'sucursal_origen' 
    FROM transferencia t , sucursal s WHERE t.fk_destino = ${idsucursal} AND t.fk_origen = s.idsucursal;`,(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}




module.exports = {
    agregar_transferencia,
    obtener_transferencias_enviadas,
    obtener_transferencias_recibidas,

}