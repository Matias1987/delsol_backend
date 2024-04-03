const mysql_connection = require("../lib/mysql_connection")

const agregar_control = (data,callback) => {
    const query = `INSERT INTO control_stock ( json, fkusuario, fksucursal, tipo, comentarios) VALUES ( '${JSON.stringify(data)}', ${data.fkusuario}, ${data.fksucursal}, 'ctr', '${data.comentarios}');`
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{callback(resp)})
    connection.end()
}

const obtener_lista_controles = (idsucursal, callback) => {
    const query = `SELECT 
    cs.*,
    DATE_FORMAT(cs.fecha, '%d-%m-%Y') AS 'fecha_f',
    s.nombre AS 'sucursal',
    u.nombre AS 'usuario'
     FROM control_stock cs, sucursal s, usuario u WHERE
    cs.fkusuario=u.idusuario AND 
    cs.fksucursal = s.idsucursal AND 
    (case when '-1'<>'${idsucursal}' then cs.fksucursal=${idsucursal} else true end)
    ORDER BY cs.id desc limit 200`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err, rows)=>{
        callback(rows)
    })
    connection.end()

}

module.exports = {obtener_lista_controles , agregar_control}