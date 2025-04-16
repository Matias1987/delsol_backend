const mysql_connection = require("../lib/mysql_connection")

const obtenerLocalidadesPorProvincia = (idProvincia, callback) => 
{
    const query = `SELECT 
    loc.id AS 'idlocalidad',
    d.id AS 'iddepartamento',
    loc.nombre AS 'localidad' , 
    d.nombre AS 'departamento',
    d.provincia_id
    FROM  localidades loc, departamentos d, provincias p
    WHERE
    loc.departamento_id = d.id AND 
    d.provincia_id = p.id AND 
    (case when '${idProvincia}'<>'-1' then d.provincia_id = ${idProvincia} else true end )
    ;`
    ;
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const obtenerProvincias = (callback) =>{
    const query = `SELECT p.id AS 'idprovincia', p.nombre AS 'provincia' FROM provincias p;`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const obtenerLocalidad = (data, callback) => {
    const connection = mysql_connection.getConnection()
    const query = ``
    connection.connect()
    connection.query(query,(err,response)=>{
        if(err)
        {
            return callback({err:1})
        }
        callback(response)
    })
    connection.end()
}

module.exports = {obtenerLocalidadesPorProvincia, obtenerProvincias, obtenerLocalidad}