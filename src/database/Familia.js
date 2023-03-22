//get connection with mysql
const mysql_connection = require("../lib/mysql_connection")

const obtener_familias = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from familia",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_familias_opt = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("SELECT f.idfamilia as 'value', f.nombre_largo as 'label' FROM familia f;",
    (err,rows,fields)=>{
        callback(rows);
    })
    connection.end();
}


const agregar_familia = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into familia (nombre_corto, nombre_largo) values (?)";

    var values = [[data.nombre_corto,data.nombre_largo]];

    connection.query(sql,values, (err,result) => {
            return callback()
        });
    connection.end();
    }

module.exports = {
    obtener_familias,
    agregar_familia,
    obtener_familias_opt
}

