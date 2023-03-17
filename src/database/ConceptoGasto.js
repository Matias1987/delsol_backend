const mysql_connection = require("../lib/mysql_connection");

const agregarConceptoGasto = (data,callback)=>{
    const connection = mysql_connection.getConnection();
    connection.connect();

    const sql = "insert into concepto_gasto (nombre) values (?)";
    const values = [
        [
            data.nombre
        ]
    ]

    connection.query(sql,values,(err,result,fields)=>{
        return callback(result.insertId);
    })

}

module.exports = {
    agregarConceptoGasto
}