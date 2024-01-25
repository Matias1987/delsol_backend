const mysql_connection = require("../lib/mysql_connection")


const agregarPagare = ( data,callback ) => {
    const query = `INSERT INTO pagare (fk_operacion, monto_int, adelanto, interes, monto) VALUES ('${data.idventa}', '${data.idventa}', '${data.idventa}', '${data.idventa}', '${data.idventa}');`
    const connection = mysql_connection.getConnection();
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const obtenerPagaresCliente = (data,callback) => {
    const query = `SELECT c.idcliente, c.apellido, c.nombre , p.* FROM pagare p, cliente c, venta v  WHERE p.fk_operacion = v.idventa AND c.idcliente = v.cliente_idcliente AND c.idcliente=${data.idcliente} AND v.estado<>'ANULADO' order by v.idventa desc;`
    const connection = mysql_connection.getConnection();
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const obtenerPagare = (data,callback) => {
    const query = `SELECT c.idcliente, c.apellido, c.nombre , p.* FROM pagare p, cliente c, venta v  WHERE p.fk_operacion = v.idventa AND c.idcliente = v.cliente_idcliente AND p.idpagare=${data.idpagare}`
    const connection = mysql_connection.getConnection();
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

module.exports = {obtenerPagaresCliente,obtenerPagare, agregarPagare}