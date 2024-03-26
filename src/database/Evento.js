const mysql_connection = require("../lib/mysql_connection");

const register_event = (data, callback) => {
    const query = `INSERT INTO evento (fecha, detalle, fk_usuario, fk_sucursal, ref_id, tipo) 
    VALUES (date('${data.fecha}'), '${data.detalle}',${data.fkusuario}, ${data.fksucursal}, ${data.refid}, '${data.tipo}');`
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}


const get_events = (data,callback) => {
    const _data = data||{}
    const fksucursal =  -1
    const fkusuario = -1
    const fecha =  _data.fecha == -1 ? -1 : `date('${data.fecha}')` 
  
    const query = `SELECT e.*, s.nombre AS 'sucursal', u.nombre AS 'usuario' 
    FROM evento e, sucursal s, usuario u WHERE 
    e.fk_usuario = u.idusuario AND 
    s.idsucursal = e.fk_sucursal AND
    (case when '${fksucursal}'<>'-1' then e.fk_sucursal=${fksucursal} else true end) and
    (case when ${fecha}<>-1 then date(e.fecha) =  ${fecha} else true end) and 
    (case when '${fkusuario}'<>'-1' then e.fk_usuario = ${fkusuario} else true end)
    ORDER BY e.idevento DESC
    `
    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

module.exports = {register_event, get_events,}