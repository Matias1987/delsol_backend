const mysql_connection = require("../lib/mysql_connection")

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

module.exports = {
    obtener_codigos,
    agregar_codigo
}
