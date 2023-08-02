const mysql_connection = require("../lib/mysql_connection");

const agregarCargaManual= (data,callback) =>
{
    const connection = mysql_connection.getConnection();

    connection.connect();

    const sql = `insert into carga_manual (
        caja_idcaja,
        usuario_idusuario,
        cliente_idcliente,
        sucursal_idsucursal,
        monto,
        concepto) 
    values (${data.caja_idcaja},${data.usuario_idusuario},${data.cliente_idcliente},${data.sucursal_idsucursal},${data.monto},'${data.concepto}')`
    
    console.log(sql)

    connection.query(sql,(err,result,fields)=>{
        return callback(result.insertId);
    })

    connection.end();
}

module.exports = {agregarCargaManual,}