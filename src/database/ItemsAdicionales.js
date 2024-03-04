const mysql_connection = require("../lib/mysql_connection")

const agregar_item_adicional = (data, callback) => {
    let query = ``
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const obtener_adicionales_venta = (data, callback) => {
    let query = ``
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

module.exports = {agregar_item_adicional, obtener_adicionales_venta}