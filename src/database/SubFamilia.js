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

const obtener_subfamilias_byfamilia_opt = (idfamilia,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        "SELECT sf.idsubfamilia as 'value', sf.nombre_largo as 'label' FROM subfamilia sf WHERE sf.familia_idfamilia = "+idfamilia+";",
        (err,rows,fields) => {
            return callback(rows);   
        }
    )
    connection.end();
}


const agregar_subfamilia = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    //check if code exists
    var _sql = `select sf.idsubfamilia from subfamilia sf where sf.nombre_corto = '${data.nombre_largo}' and sf.familia_idfamilia = ${data.familia_idfamilia};`
    connection.query(_sql,(err,rows)=>{

        if(rows.length>0){
            return callback(-1);
        }
        else{
            var sql = "insert into subfamilia (nombre_corto, nombre_largo,familia_idfamilia) values (?)";

            var values = [[data.nombre_corto,data.nombre_largo,data.familia_idfamilia]];
    
            connection.query(sql,values, (err,result) => {
                    return callback(result.insertId)
                });
        }

        connection.end();

    })
    
    
}

const obtener_subfamilias_de_familias = (data, callback) => {
    const query = `select * from subfamilia sf where sf.familia_idfamilia in (${data.ids.map(r=>r)});`
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

module.exports = {
    obtener_subfamilias_de_familias,
    obtener_subfamilias,
    agregar_subfamilia,
    obtener_subfamilias_byfamilia_opt,
}

