//get connection with mysql
const mysql_connection = require("../lib/mysql_connection")

const obtener_grupos = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select g.* from grupo  order by g.nombre_largo asc;",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_grupos_bysubfamilia_opt = (idsubfamilia, callback) =>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("SELECT g.idgrupo as 'value', g.nombre_largo as 'label' FROM grupo g WHERE g.subfamilia_idsubfamilia="+idsubfamilia+" order by g.nombre_largo asc;",
    (err,rows,fields)=>{
        return callback(rows);
    });
    connection.end();
}

const agregar_grupo = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(`SELECT g.idgrupo FROM grupo g WHERE g.subfamilia_idsubfamilia = ${data.subfamilia_idsubfamilia} AND g.nombre_corto='${data.nombre_corto}'`,
    (err,rows)=>{
        if(rows.length>0){
            return callback(-1);
        }
        else{
            var sql = "insert into grupo (nombre_corto, nombre_largo,subfamilia_idsubfamilia) values (?)";

            var values = [[
                data.nombre_corto,
                data.nombre_largo,
                data.subfamilia_idsubfamilia
            ]];
        
            connection.query(sql,values, (err,result) => {
                    return callback(result.insertId)
                });
        }

        connection.end();
    }
    )

    
    
}

module.exports = {
    obtener_grupos,
    agregar_grupo,
    obtener_grupos_bysubfamilia_opt,
}

