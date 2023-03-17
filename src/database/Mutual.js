const mysql_connection = require("../lib/mysql_connection")

const obtener_mutuales = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from mutual",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_mutual = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into mutual (nombre) values (?)";

    var values = [[
        data.nombre,
    ]];

    connection.query(sql,values, (err,result,fields) => {
            return callback(result.insertId)
        });
    connection.end();
}


module.exports = {
    obtener_mutuales,
    agregar_mutual
}