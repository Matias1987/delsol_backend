const mysql_connection = require("../lib/mysql_connection");
const venta_queries = require("./queries/ventaQueries");

const agregar_venta = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(venta_queries.queryAgregarVenta(),
        [[
            data.cliente_idcliente,
            data.sucursal_idsucursal,
            data.vendedor_idvendedor,
            data.caja_idcaja,
            data.usuario_idusuario,
            data.medico_idmedico,
            data.monto_total,
            data.descuento,
            data.monto_inicial,
            data.debe,
            data.haber,
            data.saldo,
            data.fecha,
            data.fecha_alta,
        ]],
        (err,results,fields) => {
            return callback(results.insertId)
        }
        );
    connection.end();
}

const detalle_venta = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        venta_queries.queryDetalleVenta(data.id),
        (err,results)=>{
            return callback(results)
        }
    );
    connection.end();
}

const lista_ventas = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        venta_queries.queryListaVentasTotal(),
        (err,results) => {
            return callback(results)
        }
    );
    connection.end();
}

const lista_ventas_sucursal = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        venta_queries.queryListaVentasSucursal(data.id),
        (err,results) => {
            return callback(results)
        }
    );
    connection.end();
}

module.exports = {
agregar_venta,
detalle_venta,
lista_ventas,
lista_ventas_sucursal}