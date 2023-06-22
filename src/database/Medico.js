const mysql_connection = require("../lib/mysql_connection")

const buscar_medico = (value, callback) => {
    const _value = decodeURIComponent(value);
    const query = `SELECT * FROM medico m WHERE m.nombre LIKE '%${_value}%';`;
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(query, (err,rows)=>{
        return callback(rows)
    })
    connection.end();
}

const obtener_medicos = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from medico",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_medico = (id,callback) =>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`select * from medico m where m.idmedico = ${id} ;`,(err,rows)=>{
        callback(rows)
    });
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
    agregar_medico,
    obtener_medico,
    buscar_medico,
}