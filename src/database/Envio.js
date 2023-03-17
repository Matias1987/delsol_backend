const mysql_connection = require("../lib/mysql_connection");
const envio_queries = require("./queries/envioQueries");

const agregar_envio = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        envio_queries.queryAgregarEnvio(),
        [[
            data.sucursal_idsucursal,
            data.usuario_idusuario,
            data.cantidad_total,
        ]],
        (err,results)=>{
            return callback(results.insertId);
        }
    );
    connection.end();
}

const detalle_envio = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        envio_queries.queryDetalleEnvio(data.id),
        (err,results)=>{
            return callback(results);
        }
    );
    connection.end();
}

const lista_envios = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        envio_queries.queryListaEnvios(),
        (err,results)=>{
            return callback(results);
        }
    );
    connection.end();
}


module.exports = {
    agregar_envio,
    detalle_envio,
    lista_envios,
}