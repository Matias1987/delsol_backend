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

const detalle_cliente_dni = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(
        queries.queryObtenerClientebyDNI(data.dni),
        (err,results,fields) => {
            callback(results);
        }
    )
}

module.exports = {
    agregar_cliente, 
    obtener_lista_clientes, 
    detalle_cliente_dni,
};