const mysql_connection = require("../lib/mysql_connection")

const obtener_tarjetas = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from tarjeta",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_tarjeta = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into tarjeta (nombre) values (?)";

    var values = [[
        data.nombre,
    ]];

    connection.query(sql,values, (err,result) => {
            return callback(result.insertId)
        });
    connection.end();
}

module.exports = {
    obtener_tarjetas,
    agregar_tarjeta
}