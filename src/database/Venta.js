const mysql_connection = require("../lib/mysql_connection");
const venta_queries = require("./queries/ventaQueries");

const insert_venta = (data,callback) => {

    console.log(JSON.stringify(data))

    const do_push = (arr,val,tipo) => (val||0) === 0 ? arr : [...arr,{...val,tipo:tipo}]

    var venta_id = -1;

    const get_venta_directa_items = (__data) => {
        return __data.productos.map(p=>([
            e.tipo,
            p.codigo,
            p.cantidad,
            p.precio,
            p.total,
        ]))
    }

    const get_lclab_items = (__data) => {
        var _arr = [];
        do_push(_arr,__data.productos.oi, "oi")
        do_push(_arr,__data.productos.od, "od")
        do_push(_arr,__data.productos.insumo, "insumo")
        return _arr.map((e)=>([
            e.tipo,
            venta_id,
			e.fkcodigo,
			e.cantidad,
            e.precio,
			(typeof e.esf === 'undefined' ? 0 : e.esf),
			(typeof e.cil === 'undefined' ? 0 : e.cil),
			(typeof e.eje === 'undefined' ? 0 : e.eje)
        ]))
    }

    const get_lclstock_items = (__data) => {
        var _arr = [];
        _arr = do_push(_arr,__data.productos.oi, "oi")
        _arr = do_push(_arr,__data.productos.od, "od")
        _arr = do_push(_arr,__data.productos.insumo, "insumo")
        return _arr.map((e)=>([
            e.tipo,
            venta_id,
			e.fkcodigo,
			e.cantidad,
            e.precio,
            e.total,
        ]))

    }

    const get_monoflab_items = (__data) => {
        var _arr = [];
        _arr = do_push(_arr,__data.productos.lejos_armazon,"lejos_armazon")
        _arr = do_push(_arr,__data.productos.lejos_od,"lejos_od")
        _arr = do_push(_arr,__data.productos.lejos_oi,"lejos_oi")
        _arr = do_push(_arr,__data.productos.lejos_tratamiento,"lejos_tratamiento")
        _arr = do_push(_arr,__data.productos.cerca_armazon,"cerca_armazon")
        _arr = do_push(_arr,__data.productos.cerca_od,"cerca_od")
        _arr = do_push(_arr,__data.productos.cerca_oi,"cerca_oi")
        _arr = do_push(_arr,__data.productos.cerca_tratamiento,"cerca_tratamiento")
        return _arr.map((e)=>([
            e.tipo,
            venta_id,
			e.fkcodigo,
			e.cantidad,
            e.precio,
			(typeof e.esf === 'undefined' ? 0 : e.esf),
			(typeof e.cil === 'undefined' ? 0 : e.cil),
			(typeof e.eje === 'undefined' ? 0 : e.eje)
        ]))

    }

    const get_multiflab_items = (__data) => {
        var _arr = [];
        _arr = do_push(_arr,__data.productos.armazon,"armazon")
        _arr = do_push(_arr,__data.productos.od,"od")
        _arr = do_push(_arr,__data.productos.oi,"oi")
        _arr = do_push(_arr,__data.productos.tratamiento,"tratamiento")
        return _arr.map((e)=>([
            e.tipo,
            venta_id,
			e.fkcodigo,
			e.cantidad,
            e.precio,
			(typeof e.esf === 'undefined' ? 0 : e.esf),
			(typeof e.cil === 'undefined' ? 0 : e.cil),
			(typeof e.eje === 'undefined' ? 0 : e.eje)
        ]))

    }

    const get_recstock_items = (__data) => {
        var _arr = [];
        _arr = do_push(_arr,__data.productos.lejos_armazon,"lejos_armazon")
        _arr = do_push(_arr,__data.productos.lejos_od,"lejos_od")
        _arr = do_push(_arr,__data.productos.lejos_oi,"lejos_oi")
        _arr = do_push(_arr,__data.productos.lejos_tratamiento,"lejos_tratamiento")
        _arr = do_push(_arr,__data.productos.cerca_armazon,"cerca_armazon")
        _arr = do_push(_arr,__data.productos.cerca_od,"cerca_od")
        _arr = do_push(_arr,__data.productos.cerca_oi,"cerca_oi")
        _arr = do_push(_arr,__data.productos.cerca_tratamiento,"cerca_tratamiento")
        return _arr.map((e)=>([
            e.tipo,
            venta_id,
			e.fkcodigo,
			e.cantidad,
            e.precio,
			(typeof e.esf === 'undefined' ? 0 : e.esf),
			(typeof e.cil === 'undefined' ? 0 : e.cil),
			(typeof e.eje === 'undefined' ? 0 : e.eje)
        ]))

    }

    console.log(venta_queries.venta_insert_query(venta_queries.parse_venta_data(data)))
    console.log(JSON.stringify(venta_queries.get_mp(data,venta_id)))
    console.log("--------------")
    console.log(JSON.stringify(get_recstock_items(data,venta_id)))
    //console.log()
/*
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(venta_queries.venta_insert_query(venta_queries.parse_venta_data(data)),
    (err,resp) => {
        venta_id = parseInt(resp.data);
        connection.query(venta_queries.query_mp, venta_queries.get_mp(data,venta_id),(err,resp)=>{
            const _items_data = null;
            switch(data.tipo_venta){
                case 1:
                    _items_data = get_venta_directa_items(data)
                break;
                case 2:
                    _items_data = get_lclab_items(data)
                break;
                case 3:
                    _items_data = get_lclstock_items(data)
                break;
                case 4:
                    _items_data = get_monoflab_items(data)
                break;
                case 5:
                    _items_data = get_multiflab_items(data)
                break;
                case 6:
                    _items_data = get_recstock_items(data)
                break;
            }
            connection.query(venta_queries.query_items, _items_data,(err,resp)=>{
                console.log(JSON.stringify(resp))
                callback(resp)
                connection.end();
            }) 
        })

    })*/
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
insert_venta,
//agregar_venta,
detalle_venta,
lista_ventas,
lista_ventas_sucursal}