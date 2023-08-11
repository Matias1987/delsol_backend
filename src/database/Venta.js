const mysql_connection = require("../lib/mysql_connection");
const venta_queries = require("./queries/ventaQueries");

const cambiar_estado_venta = (data, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`UPDATE venta v SET v.estado = '${data.estado}' WHERE v.idventa=${data.idventa};`,(err,results)=>{
        callback(results)
        if(typeof data.removeMPRows !== null){
            if(+data.removeMPRows == 1){
                connection.query(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.venta_idventa=${data.idventa};`)
            }
        }
        connection.end();
    })
    
}

const cambiar_venta_sucursal_deposito = (en_laboratorio, idventa, callback)=>{
    const connection = mysql_connection.getConnection()
    connection.connect()
    console.log(`UPDATE venta v SET v.en_laboratorio = ${en_laboratorio} WHERE v.idventa=${idventa};`)
    connection.query(`UPDATE venta v SET v.en_laboratorio = ${en_laboratorio} WHERE v.idventa=${idventa};`, (err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const insert_venta = (data,callback) => {

    console.log("FECHA RETIRO: "+JSON.stringify(data.fechaRetiro))

    const do_push = (orden,arr,val,tipo) => (val||0) === 0 ? arr : [...arr,{...val,tipo:tipo, orden: orden}]

    var venta_id = -1;
    var _arr = [];
    var _quantities =  {}
    var idx = [];

    const prepare_qtty_array = elements => {
        //accum by idcodigo
        elements.forEach(e=>{
            if(typeof _quantities[e.idcodigo] === 'undefined')
            {
                _quantities = {..._quantities, [e.idcodigo]:{cantidad: e.cantidad, idcodigo: e.idcodigo}}
                idx.push(e.idcodigo)
            } else{
                _quantities[e.idcodigo].cantidad += e.cantidad
            }
        })
        }

    const get_query_str = items => {
        var _str = ""
        items.forEach(e=>{
            _str += (_str.length>0? ",":"") + 
            `(
            ${venta_id},
            '${data.fksucursal}', 
            ${e.idcodigo},
            ${e.cantidad},
            '${e.tipo}',
            ${e.precio},
            ${(typeof e.total === 'undefined' ? e.precio : e.total)}, 
            '${(typeof e.esf === 'undefined' ? 0 : e.esf)}', 
            '${(typeof e.cil === 'undefined' ? 0 : e.cil)}', 
            '${(typeof e.eje === 'undefined' ? 0 : e.eje)}',
            ${e.orden})`
        })
        return _str;
    }

    const prepare_venta_directa_items = (__data) => {
        _arr = __data.productos;
    }

    const prepare_lclab_items = (__data) => {
        _arr = do_push(0,_arr,__data.productos.oi, "oi")
        _arr = do_push(1,_arr,__data.productos.od, "od")
        _arr = do_push(2,_arr,__data.productos.insumo, "insumo")
    }

    const prepare_lclstock_items = (__data) => {
        _arr = do_push(0,_arr,__data.productos.oi, "oi")
        _arr = do_push(1,_arr,__data.productos.od, "od")
        _arr = do_push(2,_arr,__data.productos.insumo, "insumo")

    }

    const prepare_monoflab_items = (__data) => {
        _arr = do_push(2,_arr,__data.productos.lejos_armazon,"lejos_armazon")
        _arr = do_push(1,_arr,__data.productos.lejos_od,"lejos_od")
        _arr = do_push(0,_arr,__data.productos.lejos_oi,"lejos_oi")
        _arr = do_push(3,_arr,__data.productos.lejos_tratamiento,"lejos_tratamiento")
        _arr = do_push(6,_arr,__data.productos.cerca_armazon,"cerca_armazon")
        _arr = do_push(5,_arr,__data.productos.cerca_od,"cerca_od")
        _arr = do_push(4,_arr,__data.productos.cerca_oi,"cerca_oi")
        _arr = do_push(7,_arr,__data.productos.cerca_tratamiento,"cerca_tratamiento")
    }

    const prepare_multiflab_items = (__data) => {
        _arr = do_push(2,_arr,__data.productos.armazon,"armazon")
        _arr = do_push(1,_arr,__data.productos.od,"od")
        _arr = do_push(0,_arr,__data.productos.oi,"oi")
        _arr = do_push(3,_arr,__data.productos.tratamiento,"tratamiento")
    }

    const prepare_recstock_items = (__data) => {
        _arr = do_push(2,_arr,__data.productos.lejos_armazon,"lejos_armazon")
        _arr = do_push(1,_arr,__data.productos.lejos_od,"lejos_od")
        _arr = do_push(0,_arr,__data.productos.lejos_oi,"lejos_oi")
        _arr = do_push(3,_arr,__data.productos.lejos_tratamiento,"lejos_tratamiento")

        _arr = do_push(6,_arr,__data.productos.cerca_armazon,"cerca_armazon")
        _arr = do_push(5,_arr,__data.productos.cerca_od,"cerca_od")
        _arr = do_push(4,_arr,__data.productos.cerca_oi,"cerca_oi")
        _arr = do_push(7,_arr,__data.productos.cerca_tratamiento,"cerca_tratamiento")
    }

    //console.log(venta_queries.venta_insert_query(venta_queries.parse_venta_data(data)))
    //console.log(JSON.stringify(venta_queries.get_mp(data,venta_id)))
    //console.log("--------------")
    //console.log(JSON.stringify(get_recstock_items(data,venta_id)))
    //console.log(venta_queries.query_items +get_recstock_items(data));

    switch(+data.tipo){
                case 1:
                    prepare_venta_directa_items(data)
                break;
                case 2:
                    prepare_recstock_items(data)
                break;
                case 3:
                    prepare_lclstock_items(data)
                break;
                case 4:
                    prepare_monoflab_items(data)
                break;
                case 5:
                    prepare_multiflab_items(data)
                break;
                case 6:
                    prepare_lclab_items(data)
                break;
            }
    
    //check quantities

    prepare_qtty_array(_arr)
    console.log("##########quantities########")

    console.log(JSON.stringify(_quantities))

    //this is for updating the stock quantities, it is not finished yet.
    /*var _ids = "";
    idx.forEach(q=>{_ids = (_ids.length>0 ? ",":"")+q.idcodigo})*/
    
    const connection = mysql_connection.getConnection();
    connection.connect();
    //check quantities
    console.log(venta_queries.venta_insert_query(venta_queries.parse_venta_data(data)))
    connection.query(venta_queries.venta_insert_query(venta_queries.parse_venta_data(data)),

    (err,resp) => {

        console.log("-----ID: "+JSON.stringify(resp))

        venta_id = parseInt(resp.insertId);

        console.log("venta guardada con id " + resp.insertId)

        var mp = ""; 

        venta_queries.get_mp(data,venta_id).forEach(p=>{
            mp+= (mp.length>0 ? ",":"")  + `(
                ${venta_id},
                ${p.modo_pago_idmodo_pago},
                ${p.banco_idbanco},
                ${p.mutual_idmutual},
                ${p.monto},
                ${p.monto_int},
                ${p.cant_cuotas},
                ${p.monto_cuota},
                ${p.fk_tarjeta},
                '${p.modo_pago}'
                )`;
        });

        var _items_data = get_query_str(_arr);

        console.log(venta_queries.query_items + _items_data)

        if(mp.length>0)
        {
        connection.query(venta_queries.query_mp + mp, (err,_resp)=>{

            connection.query(venta_queries.query_items + _items_data,(err,__resp)=>{

                console.log(JSON.stringify(resp))

                callback(venta_id)

                /*connection.query(`update stock s SET s.cantidad = s.cantidad-1 where s.codigo_idcodigo IN (${_ids}) AND s.sucursal_idsucursal = ${data.fksucursal}; `,
                (err,resp)=>{


                })*/

                connection.end();
            })
        })

        }
        else{
            if(_arr.length>0){
                connection.query(venta_queries.query_items + _items_data,(err,__resp)=>{

                    console.log(JSON.stringify(resp))
    
                    callback(venta_id)
    
                    /*connection.query(`update stock s SET s.cantidad = s.cantidad-1 where s.codigo_idcodigo IN (${_ids}) AND s.sucursal_idsucursal = ${data.fksucursal}; `,
                    (err,resp)=>{
    
    
                    })*/
    
                    connection.end();
                })
            }
            else{
                callback(venta_id)
                connection.end();
            }
        }

    })
    
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

const detalle_venta = (idventa,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    console.log(venta_queries.queryDetalleVenta(idventa))
    connection.query(
        venta_queries.queryDetalleVenta(idventa),
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

const lista_venta_sucursal_estado = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    console.log(JSON.stringify(data))
    console.log(venta_queries.queryListaVentasSucursalEstado(
        data.idsucursal,
        (typeof data.estado === 'undefined' ? "" : data.estado),
        (typeof data.tipo === 'undefined' ? "" : data.tipo),
        (typeof data.idmedico === 'undefined' ? "" : data.idmedico),
        (typeof data.iddestinatario === 'undefined' ? "" : data.iddestinatario),
        (typeof data.idcliente === 'undefined' ? "" : data.idcliente),
        (typeof data.id === 'undefined' ? "" : data.id),
        (typeof data.en_laboratorio === 'undefined'? "" : data.en_laboratorio)
           
       
        ))
    connection.query(
        venta_queries.queryListaVentasSucursalEstado(
            data.idsucursal,
            (typeof data.estado === 'undefined' ? "" : data.estado),
        (typeof data.tipo === 'undefined' ? "" : data.tipo),
        (typeof data.idmedico === 'undefined' ? "" : data.idmedico),
        (typeof data.iddestinatario === 'undefined' ? "" : data.iddestinatario),
        (typeof data.idcliente === 'undefined' ? "" : data.idcliente),
        (typeof data.id === 'undefined' ? "" : data.id),
        (typeof data.en_laboratorio === 'undefined'? "" : data.en_laboratorio)
           
            ),(err,data) => {
                callback(data)
            }
    )
    connection.end();

}

const lista_venta_mp = (idventa, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`SELECT vmp.* FROM venta_has_modo_pago vmp  
    WHERE     vmp.venta_idventa = ${idventa};`,(err,rows)=>{
        return callback(rows)
    })
    connection.end()
}
const lista_venta_mp_cta_cte = (idventa, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`SELECT vmp.*  FROM venta_has_modo_pago vmp
    WHERE vmp.modo_pago = 'ctacte'  AND
     vmp.venta_idventa = ${idventa};`,(err,rows)=>{
        return callback(rows)
    })
    connection.end()
}

const lista_venta_item = (idventa, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(venta_queries.queryListaVentaStock(idventa),(err,rows)=>{
        callback(rows)
    })
    connection.end()
}



module.exports = {
insert_venta,
//agregar_venta,
detalle_venta,
lista_ventas,
lista_ventas_sucursal,
lista_venta_mp,
lista_venta_sucursal_estado,
lista_venta_item,
cambiar_estado_venta,
lista_venta_mp_cta_cte,
cambiar_venta_sucursal_deposito,
}


/*
    const get_venta_directa_items = (__data) => {
        return __data.productos.map(p=>([
            e.tipo,
            venta_id,
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

    }*/