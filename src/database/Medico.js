const mysql_connection = require("../lib/mysql_connection")

const obtener_medicos = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from medico",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_medico = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into medico (nombre, matricula) values (?)";

    var values = [[
        data.nombre,
        data.matricula,
    ]];

    connection.query(sql,values, (err,result,fields) => {
            return callback(result.insertId)
        });
    connection.end();
}

module.exports = {
    obtener_medicos,
    agregar_medico
}