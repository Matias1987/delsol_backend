const mysql_connection = require("../lib/mysql_connection")

const agregarAnotacion = (data,callback) => {
    
    const query = `INSERT INTO anotacion (nota, fkusuario, fksucursal, tipo, refId) 
    VALUES ('${data.nota}', ${data.fkusuario}, ${data.fksucursal}, '${data.tipo}', ${data.refId});`

    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const obtenerAnotacion = (idanotacion, callback) =>{
    const query = `SELECT 
    a.*, 
    u.nombre AS 'usuario', 
    s.nombre AS 'sucursal' 
    FROM anotacion a, usuario u, sucursal s WHERE 
    u.idusuario=a.fkusuario AND 
    s.idsucursal=a.fksucursal AND
    a.idanotacion=${idanotacion}
    ;`

    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const obtenerAnotaciones = (callback) => {
    const query = `SELECT 
    a.*, 
    u.nombre AS 'usuario', 
    s.nombre AS 'sucursal' 
    FROM anotacion a, usuario u, sucursal s WHERE 
    u.idusuario=a.fkusuario AND 
    s.idsucursal=a.fksucursal 
    ;`
    const connection = mysql_connection.getConnection()
    connection.query(query,(err,rows)=>{
        callback(query)
    })
    connection.end()
}

module.exports = {agregarAnotacion,obtenerAnotacion,obtenerAnotaciones,}