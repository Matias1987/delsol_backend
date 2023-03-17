const mysql_connection = require("../lib/mysql_connection");

const agregarCaja = (data,callback) =>
{
    const connection = mysql_connection.getConnection();

    connection.connect();

    const sql = "insert into caja (sucursal_idsucursal,monto_inicial,estado) values (?)"
    values = [[data.sucursal_idsucursal, data.monto_inicial, "ABIERTA"]];


    connection.query(sql,values,(err,result,fields)=>{
        return callback(result.insertId);
    })

    connection.end();
}

module.exports = {agregarCaja,}