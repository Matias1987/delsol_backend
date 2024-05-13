const mysql_connection = require("../lib/mysql_connection");

const obtenerCargaManual = (idcargamanual,callback) => {
    const query =  `select * from carga_manual cm where cm.idcarga_manual = ${idcargamanual}`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const modificar_carga_manual = (data,callback)=> 
{
    const query = `update carga_manual cm set cm.monto = ${data.monto} where cm.idcarga_manual= ${data.id}`
    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

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
    
    //console.log(sql)

    connection.query(sql,(err,result,fields)=>{
        return callback(result.insertId);
    })

    connection.end();
}

const anularCargaManual = (data,callback)=>{
    const query = `update carga_manual cm set cm.anulado = 1 where cm.idcarga_manual=${data.id}`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
}

module.exports = {agregarCargaManual, anularCargaManual,obtenerCargaManual,modificar_carga_manual,}