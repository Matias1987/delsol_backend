const mysql_connection = require("../lib/mysql_connection")

const obtener_detalle_sucursal = (idsucursal,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`select s.*, o.nombre as 'optica' from sucursal s inner join optica o on o.idoptica = s.fkoptica where s.idsucursal = ${idsucursal};` ,
    (err,resp)=>{
        callback(resp)
    })
    connection.end();
} 


const obtener_sucursales = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select s.*, o.nombre as 'optica' from sucursal s inner join optica o on o.idoptica = s.fkoptica;  ",(err,rows,fields)=>{
        callback(rows);
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
    agregar_sucursal,
    obtener_detalle_sucursal,
}