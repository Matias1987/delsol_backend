const mysql_connection = require("../lib/mysql_connection")

const AgregarLlamadaCliente = (params,callback) => {
    const query = `INSERT INTO llamada_cliente (comentarios, fk_usuario, fk_sucursal, fk_cliente) VALUES ('${params.comentarios}', ${params.fkusuario}, ${params.fksucursal}, ${params.fkcliente});`
    const connection =mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const ObtenerLlamadasCliente = (idcliente, callback) => {
    const query = `SELECT DATE_FORMAT(lc.fecha,'%d-%m-%y') AS 'fecha_f', s.nombre AS 'sucursal', u.nombre AS 'usuario', lc.* FROM llamada_cliente lc , usuario u, sucursal s WHERE 
    lc.fk_usuario = u.idusuario AND
    lc.fk_sucursal = s.idsucursal AND 
    lc.fk_cliente=${idcliente}  ORDER BY lc.fecha desc`
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query, (err,rows)=>{
        callback(rows)
    })
}

module.exports = {AgregarLlamadaCliente, ObtenerLlamadasCliente,}