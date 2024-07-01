const mysql_connection = require("../lib/mysql_connection")

const agregarAnotacion = (data,callback) => {
    
    const query = `INSERT INTO anotacion (nota, fkusuario, fksucursal, tipo, refId) 
    VALUES ('${data.mensaje}', ${data.fkusuario}, ${data.fksucursal}, '${data.tipo}', ${data.refId});`
    //console.log(query)
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

const obtenerAnotaciones = (params,callback) => {
    const _idref = typeof params.idref === 'undefined' ? -1 : params.idref
    const _tipo =  typeof params.tipo === 'undefined' ? -1 : params.tipo
    const query = `SELECT 
    a.*, 
    DATE_FORMAT( a.fecha , '%d-%m-%Y') AS 'fecha_f' ,
    u.nombre AS 'usuario', 
    s.nombre AS 'sucursal' 
    FROM anotacion a, usuario u, sucursal s WHERE 
    u.idusuario=a.fkusuario AND 
    s.idsucursal=a.fksucursal AND 
    (case when '${_idref}}'<>'-1' then a.refId='${_idref}' ELSE TRUE END) and
    (case when '${_tipo}}'<>'-1' then a.tipo='${_tipo}' ELSE TRUE END)
    order by a.idanotacion desc;`
    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

module.exports = {agregarAnotacion,obtenerAnotacion,obtenerAnotaciones,}