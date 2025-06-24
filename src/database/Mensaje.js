const mysql_connection = require("../lib/mysql_connection")

const obtener_mensajes = (callback) => {
    const query = `SELECT m.*, date_format(m.fecha, '%d-%m-%y %H:%i') as 'fecha_f', u.nombre AS 'emisor' FROM mensaje m, usuario u WHERE m.fkemisor = u.idusuario ORDER BY m.idmensaje asc limit 300; `
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
    
}

const agregar_mensaje = (data, callback) => {
    const connection = mysql_connection.getConnection()
    connection.connect()
    const query = `insert into mensaje (fkemisor, mensaje) values (${data.fkemisor}, '${data.mensaje}') `
    console.log(query)
    //console.log(`insert into mensaje (fkemisor, mensaje) values (${data.fkemisor}, '${data.mensaje}') `)
    connection.query(query,(err,data)=>{
        callback(data)
    })
    connection.end()
    
}

module.exports = {obtener_mensajes, agregar_mensaje}