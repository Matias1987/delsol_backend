//get connection with mysql
const mysql_connection = require("../lib/mysql_connection")

const obtener_subfamilias = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from subfamilia",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}


const agregar_subfamilia = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into subfamilia (nombre_corto, nombre_largo,familia_idfamilia) values (?)";

    var values = [[data.nombre_corto,data.nombre_largo,data.familia_idfamilia]];

    connection.query(sql,values, (err,result) => {
            return callback(result.insertId)
        });
    connection.end();
}

module.exports = {
    obtener_subfamilias,
    agregar_subfamilia
}

