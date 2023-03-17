const mysql_connection = require("../lib/mysql_connection")

const obtener_subgrupos = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from subgrupo",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_subgrupo = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into subgrupo (nombre_corto, nombre_largo,grupo_idgrupo) values (?)";

    var values = [[
        data.nombre_corto,
        data.nombre_largo,
        data.grupo_idgrupo
    ]];

    connection.query(sql,values, (err,result) => {
            return callback(result.insertId)
        });
    connection.end();
}

module.exports = {
    obtener_subgrupos,
    agregar_subgrupo
}
