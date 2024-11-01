const { get_uid } = require("../lib/helpers")
const mysql_connection = require("../lib/mysql_connection")

const agregar_tarea = (data, callback) =>{
   
    /*const values = [
        data.fk_parent,
        data.nombre,
        data.ref_id
    ]*/

    const uid = data.fk_parent == null ? get_uid("1") : null
   
    const connection = mysql_connection.getConnection()
    connection.connect()

    const query = `insert into tarea (fk_parent,nombre,ref_id, uid, descripcion) 
    values (${connection.escape(data.fk_parent)}, ${connection.escape(data.nombre)}, ${connection.escape(data.ref_id)}, ${connection.escape(uid)}, ${connection.escape(data.descripcion || "Control")})
    on duplicate key update activo = if(activo=1,0,1)
    `

    //console.log(query)

    connection.query(query,  (err,resp)=>{
        callback(resp)
    })

    connection.end()

}

const obtener_tareas = (data, callback) =>{
    const connection = mysql_connection.getConnection()
    
    const query = `select *, concat(date_format(t.fecha, '%d-%m-%y'),' ', t.descripcion) as 'desc' from tarea t where t.fk_parent is null and t.nombre=${connection.escape(data.nombre)} order by t.idtarea desc`
    console.log(query)
    connection.connect()

    connection.query(query,(err,resp)=>{
        callback(resp)
    })

    connection.end()

}

module.exports={agregar_tarea, obtener_tareas}