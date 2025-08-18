const mysql_connection = require("../lib/mysql_connection");

const obtenerConceptosGastos = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select cg.* from concepto_gasto cg where cg.activo = 1 order by cg.nombre asc", (err, rows) => {
        callback(rows)
    })
    connection.end()
}

const agregarConceptoGasto = (data,callback)=>{
    const connection = mysql_connection.getConnection();
    connection.connect();

    const sql = `insert into concepto_gasto (nombre) values (${connection.escape(data.nombre)})`;

    console.log(sql);

    connection.query(sql,(err,result,fields)=>{
        return callback(result.insertId);
    })

    connection.end()

}

module.exports = {
    agregarConceptoGasto,
    obtenerConceptosGastos,
}