const mysql_connection = require("../lib/mysql_connection")

const obtener_sucursales = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from sucursal",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_sucursal = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into sucursal (nombre) values (?)";

    var values = [[
        data.nombre,
    ]];

    connection.query(sql,values, (err,result,fields) => {
            return callback(result.insertId);
        });
    connection.end();
}

module.exports = {
    obtener_sucursales,
    agregar_sucursal
}