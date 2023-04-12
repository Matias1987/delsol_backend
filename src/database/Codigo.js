const mysql_connection = require("../lib/mysql_connection")

const search_codigos = (data, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        `SELECT c.idcodigo,c.codigo,c.descripcion FROM codigo c WHERE c.codigo LIKE '%${data}%' OR c.descripcion LIKE '%${data}%';`
        ,(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_codigo = (idcodigo,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`select * from codigo where idcodigo=${idcodigo}`,(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_codigos = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from codigo",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_codigo = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into codigo (codigo, descripcion,subgrupo_idsubgrupo) values (?)";

    var values = [[
        data.codigo,
        data.descripcion,
        data.subgrupo_idsubgrupo
    ]];

    connection.query(sql,values, (err,result) => {
            return callback()
        });
    connection.end();
}

const obtener_codigos_bysubgrupo_opt = (idsubgrupo,callback) =>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("SELECT c.idcodigo AS 'value', c.codigo AS 'label' FROM codigo c WHERE c.subgrupo_idsubgrupo = "+idsubgrupo+";",(err,rows,fields)=>{
        return callback(rows);
    });
    connection.end();
}

module.exports = {
    obtener_codigos,
    agregar_codigo,
    obtener_codigos_bysubgrupo_opt,
    search_codigos,
    obtener_codigo,
}
