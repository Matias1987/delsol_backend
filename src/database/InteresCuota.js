const mysql_connection = require("../lib/mysql_connection")

 const obtenerInteresCuotas = (callback) => {

    const query = "SELECT mc.cantidad_cuotas, mc.interes FROM mult_cuota mc;"

    const connection = mysql_connection.getConnection();

    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()

 }

 const modifInteresCuota = (data,callback) => 
 {

 }

 module.exports = {obtenerInteresCuotas,modifInteresCuota}