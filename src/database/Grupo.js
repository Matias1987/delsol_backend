//get connection with mysql
const mysql_connection = require("../lib/mysql_connection")

const obtener_grupos = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from grupo",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_grupo = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into grupo (nombre_corto, nombre_largo,subfamilia_idsubfamilia) values (?)";

    var values = [[
        data.nombre_corto,
        data.nombre_largo,
        data.subfamilia_idsubfamilia
    ]];

    connection.query(sql,values, (err,result) => {
            return callback(result.insertId)
        });
    connection.end();
}

module.exports = {
    obtener_grupos,
    agregar_grupo
}

