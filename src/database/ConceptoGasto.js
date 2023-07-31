const mysql_connection = require("../lib/mysql_connection");

const obtenerConceptosGastos = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from concepto_gasto",(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

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

    connection.end()

}

module.exports = {
    agregarConceptoGasto,
    obtenerConceptosGastos,
}