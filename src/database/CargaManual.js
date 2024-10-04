const mysql_connection = require("../lib/mysql_connection");
const UsuarioDB = require("./Usuario")

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

const do_agregarCargaManual = (data, callback) => {
    const connection = mysql_connection.getConnection();

    connection.connect();

    const sql = `insert into carga_manual (
        caja_idcaja,
        usuario_idusuario,
        cliente_idcliente,
        sucursal_idsucursal,
        monto,
        concepto) 
    values (${connection.escape(data.caja_idcaja)},${connection.escape(data.usuario_idusuario)},${connection.escape(data.cliente_idcliente)},${connection.escape(data.sucursal_idsucursal)},${connection.escape(data.monto)},${connection.escape(data.concepto)})`
    
    //console.log(sql)

    connection.query(sql,(err,result,fields)=>{
        return callback(result.insertId);
    })

    connection.end();
}

const agregarCargaManual= (data,callback) =>
{
    UsuarioDB.validar_usuario_be({tk:data.tk},()=>{do_agregarCargaManual(data,callback)},()=>{})
}

const anularCargaManual = (data,callback)=>{
    const connection = mysql_connection.getConnection()
    const query = `update carga_manual cm set cm.anulado = 1 where cm.idcarga_manual=${connection.escape(data.id)}`
    
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
}

module.exports = {agregarCargaManual, anularCargaManual,obtenerCargaManual,modificar_carga_manual,}