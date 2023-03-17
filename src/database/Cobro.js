const mysql_connection = require("../lib/mysql_connection");
const cobro_queries = require("./queries/cobroQueries");

const agregar_cobro  = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        cobro_queries.queryAgregarCobro(),
        [[
            data.caja_idcaja,
            data.usuario_idusuario,
            data.cliente_idcliente,
            data.venta_idventa,
            data.monto,
            data.tipo
        ]],
        (err,results)=>{
            return callback(results.insertId);
        }
    );
    connection.end();
}

const lista_cobros = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        cobro_queries.queryListaCobros(),
        (err,results)=>{
            return callback(results);
        }
    );
    connection.end();
}

const lista_cobros_sucursal = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        cobro_queries.queryListaCobrosSucursal(data.id),
        (err,results)=>{
            return callback(results);
        }
    );
    connection.end();
}

const detalle_cobro = (data, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        cobro_queries.queryDetalleCobro(data.id),(err,results)=>{
            return callback(results);
        }
    );
    connection.end();
}

module.exports = {
    agregar_cobro,
    lista_cobros,
    lista_cobros_sucursal,
    detalle_cobro
}