const mysql_connection = require("../lib/mysql_connection");


const obtenerBancos = (callback) => {

    connection = mysql_connection.getConnection();

    connection.connect();

    connection.query("select * from banco", (err,rows,fields)=>{
        return callback(rows);
    })

    connection.end();


}

const obtenerBanco = (callback) => {
    const connection = mysql_connection.getConnection();

    connection.connect();

    connection.query("select * from banco b where b.idbanco = 0 ", (err,rows,fields) =>{
        return callback(rows);
    })

    connection.end();
}

const agregarBanco = (data,callback) => {
    const connection = mysql_connection.getConnection();

    connection.connect();

    connection.query('insert into banco (nombre) values (\''+data.nombre+'\')', (err,result,fields) =>{
        return callback(result.insertId);
    })

    connection.end();
}

module.exports = {
    obtenerBancos,
    agregarBanco
}