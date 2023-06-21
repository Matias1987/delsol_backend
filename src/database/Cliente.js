const queries = require("./queries/clienteQueries")
const mysql_connection = require("../lib/mysql_connection")

const agregar_cliente = (data, callback) => {
    
    //create connection 
    const connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(
        queries.queryAgregarCliente(),
        [[
            data.localidad_idlocalidad,
            data.nombre,
            data.apellido,
            data.direccion,
            data.dni,
            data.telefono1,
            data.telefono2
        ]],
        (err,results,fields) => {
            return callback(results.insertId)
        }
    )

    connection.end();

}

const obtener_lista_clientes = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(
        queries.queryObtenerListaClientes(),
        (err,results,fields) =>{
            callback(results)
        }
    )

    connection.end();
}

const detalle_cliente_dni = (dni,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    console.log(queries.queryObtenerClientebyDNI(dni))
    connection.query(
        queries.queryObtenerClientebyDNI(dni),
        (err,results,fields) => {
            callback(results);
        }
    )
    connection.end();
}
const detalle_cliente = (id,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    console.log(queries.queryObtenerClientebyID(id))
    connection.query(
        queries.queryObtenerClientebyID(id),
        (err,results,fields) => {
            callback(results);
        }
    )
    connection.end();
}

const buscar_cliente = (value, callback) =>{
    var _value = decodeURIComponent(value);
    const connection = mysql_connection.getConnection();
    connection.connect();
    
    connection.query(
        `SELECT c.* FROM cliente c WHERE 
    c.apellido LIKE '%${_value}%' OR
    c.nombre LIKE '%${_value}%' OR 
    c.dni LIKE '%${_value}%';`,
    (err,rows)=>{
        console.log(JSON.stringify(rows))
        callback(rows)
    });
    connection.end();


}

module.exports = {
    agregar_cliente, 
    obtener_lista_clientes, 
    detalle_cliente_dni,
    detalle_cliente,
    buscar_cliente,
};