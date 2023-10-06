const mysql_connection = require("../lib/mysql_connection")

const obtenerLocalidadesPorProvincia = (idProvincia, callback) => 
{
    const query = `SELECT 
    loc.id AS 'idlocalidad',
    d.id AS 'iddepartamento',
    loc.nombre AS 'localidad' , 
    d.nombre AS 'departamento'
    FROM  localidades loc, departamentos d, provincias p
    WHERE
    loc.departamento_id = d.id AND 
    d.provincia_id = p.id AND 
    d.provincia_id = ${idProvincia}
    ;`
    ;
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

module.exports = {obtenerLocalidadesPorProvincia, obtenerProvincias}