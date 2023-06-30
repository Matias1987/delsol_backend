const mysql_connection = require("../lib/mysql_connection");
const venta_queries = require("./queries/ventaQueries");

const insert_venta = (data,callabck) => {

    do_push = (arr,val) => (val||0) === 0 ? arr : [...arr,val]

    const get_venta_directa_items = (data) => {
        
    }

    const get_lclab_items = (data) => {}

    const get_lclstock_items = (data) => {
        const _arr = [];
        do_push(_arr,data.productos.lejos_armazon)
        do_push(_arr,data.productos.lejos_od)
        do_push(_arr,data.productos.lejos_oi)
        do_push(_arr,data.productos.lejos_tratamiento)
        do_push(_arr,data.productos.cerca_armazon)
        do_push(_arr,data.productos.cerca_od)
        do_push(_arr,data.productos.cerca_oi)
        do_push(_arr,data.productos.cerca_tratamiento)
        return __arr.map((e)=>([
            venta_id,
			e.fkcodigo,
			e.cantidad,
			(typeof e.esf === 'undefined' ? 0 : e.esf),
			(typeof e.cil === 'undefined' ? 0 : e.cil),
			(typeof e.eje === 'undefined' ? 0 : e.eje)
        ]))

    }

    const get_monoflab_items = (data) => {
        

    }

    const get_multiflab_items = (data) => {
        

    }

    const get_recstock_items = (data) => {
        

    }
}

/*const agregar_venta = (data,callback) => {
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
}*/

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
//agregar_venta,
agregar_venta,
detalle_venta,
lista_ventas,
lista_ventas_sucursal}