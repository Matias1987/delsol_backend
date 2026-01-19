const mysql_connection = require("../lib/mysql_connection");
const { doQuery } = require("./helpers/queriesHelper");

const buscar_mutual = (value, callback) => {
    const _value = decodeURIComponent(value);
    const query = `SELECT * FROM mutual m WHERE m.nombre LIKE '%${_value}%';`;
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(query, (err,rows)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_mutuales = (callback,todos=false) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select m.* from mutual m "+ (todos ? "" : "where m.activo = 1"),(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_mutual = (id,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`select * from mutual m where m.idmutual = ${id}`,(err,rows)=>{
        callback(rows)
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

const activar_mutual = ({id, activo},callback) => {
    console.log("activar_mutual", id, activo);

    doQuery(`update mutual set activo = ${activo} where idmutual = ${id}`,(result)=>{
        console.log("activar_mutual result", result);
        return callback(result.data)
    });
}

module.exports = {
    obtener_mutuales,
    agregar_mutual,
    obtener_mutual,
    buscar_mutual,
    activar_mutual,
}