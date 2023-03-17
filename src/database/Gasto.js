const mysql_connection = require("../lib/mysql_connection")

const obtener_gasto = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from gasto",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_gasto = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into medico (caja_idcaja, usuario_idusuario,concepto_gasto_idconcepto_gasto,monto,sucursal_idsucursal) values (?)";

    var values = [[
        data.caja_idcaja,
        data.usuario_idusuario,
        data.concepto_gasto_idconcepto_gasto,
        data.monto,
        data.sucursal_idsucursal,
    ]];

    connection.query(sql,values, (err,result) => {
            return callback(result.insertId)
        });
    connection.end();
}

module.exports = {
    obtener_gasto,
    agregar_gasto
}