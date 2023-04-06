const mysql_connection = require("../lib/mysql_connection");
const envio_queries = require("./queries/envioQueries");

const agregar_envio = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        `insert into envio (
            sucursal_idsucursal
            usuario_idusuario
            cantidad_total)
            values (${data.sucursal_idsucursal},${data.usuario_idusuario},${data.cantidad_total})`
            ,
        (err,results)=>{
            let values = []
            data.items.forEach(element => {
                values.push( [
                    results.insertId,
                    element.codigo_idcodigo,
                    element.cantidad
                ])
            });

            connection.query("INSERT INTO `envio_has_stock` (`envio_idenvio`, `codigo_idcodigo`,  `cantidad`) VALUES (?);",
            values,
            
            (err,res)=>{
                callback(res);
            })
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