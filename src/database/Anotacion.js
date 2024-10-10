const mysql_connection = require("../lib/mysql_connection")

const agregarAnotacion = (data,callback) => {
    
    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()

    const query = `INSERT INTO anotacion (nota, fkusuario, fksucursal, tipo, refId) 
    VALUES (${connection.escape(data.mensaje)}, ${connection.escape(data.fkusuario)}, ${connection.escape(data.fksucursal)}, ${connection.escape(data.tipo)}, ${connection.escape(data.refId)});`
    console.log(query)
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const obtenerAnotacion = (idanotacion, callback) =>{
    

    const connection = mysql_connection.getConnection()
    connection.connect()
    const query = `SELECT 
    a.*, 
    u.nombre AS 'usuario', 
    s.nombre AS 'sucursal' 
    FROM anotacion a, usuario u, sucursal s WHERE 
    u.idusuario=a.fkusuario AND 
    s.idsucursal=a.fksucursal AND
    a.idanotacion=${connection.escape(idanotacion)}
    ;`
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const obtenerAnotaciones = (params,callback) => {
    
    //
    const connection = mysql_connection.getConnection()
    console.log(params.tipo)
    const _idref = typeof params.idref === 'undefined' ? '-1' : params.idref.toString()
    const _tipo =  typeof params.tipo === 'undefined' ? '-1' : params.tipo.toString()
    const query = `SELECT 
    a.*, 
    DATE_FORMAT( a.fecha , '%d-%m-%Y') AS 'fecha_f' ,
    u.nombre AS 'usuario', 
    s.nombre AS 'sucursal' 
    FROM anotacion a, usuario u, sucursal s WHERE 
    u.idusuario=a.fkusuario AND 
    s.idsucursal=a.fksucursal AND 
    (case when ${connection.escape(_idref)}<>'-1' then a.refId=${connection.escape(_idref)} ELSE TRUE END) and
    (case when ${connection.escape(_tipo)}<>'-1' then a.tipo=${connection.escape(_tipo)} ELSE TRUE END)
    order by a.idanotacion desc;`
    //console.log(query)
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

module.exports = {agregarAnotacion,obtenerAnotacion,obtenerAnotaciones,}