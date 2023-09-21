const { parse_date_for_mysql } = require("../lib/helpers");
const mysql_connection = require("../lib/mysql_connection");
const venta_queries = require("./queries/ventaQueries");

const lista_ventas_admin = () => {
    const query = `SELECT
    CONCAT(c.apellido,' ', c.nombre) AS 'cliente',
    u.nombre AS 'vendedor', 
    v.idventa, 
    v.monto_total, 
    FROM cliente c, usuario u, venta v, sucursal s 
    WHERE 
    v.cliente_idcliente = c.idcliente AND 
    v.usuario_idusuario = u.idusuario AND 
    v.sucursal_idsucursal = s.idsucursal;`
}

const anular_venta = (data, callback) => {
    /**
     * restaurar stock y marcar venta como anulada
     */
}

const desc_cantidades_stock_venta = (data,callback) =>
{
    const query = `UPDATE stock s, 
    (
        SELECT 
        vhs.stock_sucursal_idsucursal AS 'idsucursal',
        vhs.stock_codigo_idcodigo AS 'idcodigo', 
        vhs.cantidad 
        FROM venta_has_stock vhs WHERE vhs.venta_idventa=${data.idventa}  AND vhs.descontable=1
    ) AS vs
    SET s.cantidad = s.cantidad - vs.cantidad WHERE
    s.codigo_idcodigo = vs.idcodigo AND 
    s.sucursal_idsucursal = vs.idsucursal;`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end();
    
}
const inc_cantidades_stock_venta = (data,callback) =>
{
    const query = `UPDATE stock s, 
    (
        SELECT 
        vhs.stock_sucursal_idsucursal AS 'idsucursal',
        vhs.stock_codigo_idcodigo AS 'idcodigo', 
        vhs.cantidad 
        FROM venta_has_stock vhs WHERE vhs.venta_idventa=${data.idventa}  AND vhs.descontable=1
    ) AS vs
    SET s.cantidad = s.cantidad - vs.cantidad WHERE
    s.codigo_idcodigo = vs.idcodigo AND 
    s.sucursal_idsucursal = vs.idsucursal;`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end();
    
}

const cambiar_estado_venta = (data, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`UPDATE venta v SET v.estado = '${data.estado}' WHERE v.idventa=${data.idventa};`,(err,results)=>{
        callback(results)
        if(typeof data.removeMPRows !== 'undefined'){
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

    //console.log("FECHA RETIRO: "+JSON.stringify(data.fechaRetiro))

    const __now = new Date();

    if(data.fechaRetiro == null){
        data.fechaRetiro = `${__now.getDate()}-${__now.getMonth()}-${__now.getFullYear()}`;//parse_date_for_mysql(`${__now.getDate()}-${__now.getMonth()}-${__now.getFullYear()}` )

    }

    const do_push = (orden,arr,val,tipo,descontable) => (val||0) === 0 ? arr : [...arr,{...val,tipo:tipo, orden: orden, descontable: descontable}]

    var venta_id = -1;
    var _arr_items = [];
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
            ${typeof e.orden === 'undefined' ? 0 : e.orden},
            ${typeof e.descontable === 'undefined'? 1 : e.descontable }
            )`
        })
        return _str;
    }

    const prepare_venta_directa_items = (__data) => {
        _arr_items = __data.productos;
    }

    const prepare_lclab_items = (__data) => {
        _arr_items = do_push(0,_arr_items,__data.productos.oi, "oi",1)
        _arr_items = do_push(1,_arr_items,__data.productos.od, "od",1)
        _arr_items = do_push(2,_arr_items,__data.productos.insumo, "insumo",1)
    }

    const prepare_lclstock_items = (__data) => {
        _arr_items = do_push(0,_arr_items,__data.productos.oi, "oi",1)
        _arr_items = do_push(1,_arr_items,__data.productos.od, "od",1)
        _arr_items = do_push(2,_arr_items,__data.productos.insumo, "insumo",1)

    }

    const prepare_monoflab_items = (__data) => {
        _arr_items = do_push(2,_arr_items,__data.productos.lejos_armazon,"lejos_armazon",1)
        _arr_items = do_push(1,_arr_items,__data.productos.lejos_od,"lejos_od",1)
        _arr_items = do_push(0,_arr_items,__data.productos.lejos_oi,"lejos_oi",1)
        _arr_items = do_push(3,_arr_items,__data.productos.lejos_tratamiento,"lejos_tratamiento",1)
        _arr_items = do_push(6,_arr_items,__data.productos.cerca_armazon,"cerca_armazon",1)
        _arr_items = do_push(5,_arr_items,__data.productos.cerca_od,"cerca_od",1)
        _arr_items = do_push(4,_arr_items,__data.productos.cerca_oi,"cerca_oi",1)
        _arr_items = do_push(7,_arr_items,__data.productos.cerca_tratamiento,"cerca_tratamiento",1)
    }

    const prepare_multiflab_items = (__data) => {
        _arr_items = do_push(2,_arr_items,__data.productos.armazon,"armazon",1)
        _arr_items = do_push(1,_arr_items,__data.productos.od,"od",1)
        _arr_items = do_push(0,_arr_items,__data.productos.oi,"oi",1)
        _arr_items = do_push(3,_arr_items,__data.productos.tratamiento,"tratamiento",1)
    }

    const prepare_recstock_items = (__data) => {
        _arr_items = do_push(2,_arr_items,__data.productos.lejos_armazon,"lejos_armazon",1)
        _arr_items = do_push(1,_arr_items,__data.productos.lejos_od,"lejos_od",1)
        _arr_items = do_push(0,_arr_items,__data.productos.lejos_oi,"lejos_oi",1)
        _arr_items = do_push(3,_arr_items,__data.productos.lejos_tratamiento,"lejos_tratamiento",1)

        _arr_items = do_push(6,_arr_items,__data.productos.cerca_armazon,"cerca_armazon",1)
        _arr_items = do_push(5,_arr_items,__data.productos.cerca_od,"cerca_od",1)
        _arr_items = do_push(4,_arr_items,__data.productos.cerca_oi,"cerca_oi",1)
        _arr_items = do_push(7,_arr_items,__data.productos.cerca_tratamiento,"cerca_tratamiento",1)
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

    prepare_qtty_array(_arr_items)
    console.log("##########quantities########")

    console.log(JSON.stringify(_quantities))

    //this is for updating the stock quantities, it is not finished yet.
    /*var _ids = "";
    idx.forEach(q=>{_ids = (_ids.length>0 ? ",":"")+q.idcodigo})*/
    
    const connection = mysql_connection.getConnection();
    connection.connect();
    //check quantities
    console.log("*************** "+venta_queries.venta_insert_query(venta_queries.parse_venta_data(data)))
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

        var _items_data = get_query_str(_arr_items);

        console.log(venta_queries.query_items + _items_data)
        console.log("*****VENTA MODO DE PAGO*******************")
        console.log(venta_queries.query_mp + mp)

        if(mp.length>0)
        {
        connection.query(venta_queries.query_mp + mp, (err,_resp)=>{
            
            connection.query(venta_queries.query_items + _items_data,(err,__resp)=>{

                console.log(JSON.stringify(resp))

                callback(venta_id)

                connection.end();
            })
        })

        }
        else{
            if(_arr_items.length>0){
                connection.query(venta_queries.query_items + _items_data,(err,__resp)=>{

                    console.log(JSON.stringify(resp))
    
                    callback(venta_id)
    
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
        (typeof data.idsucursal === 'undefined' ? "" : data.idsucursal),
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
    connection.query(`SELECT vmp.*,
                    if(t.idtarjeta IS NULL , '' , t.nombre) AS 'nombre_tarjeta',
                    if(b.idbanco IS NULL ,'', b.nombre) AS 'nombre_banco'
                    FROM 
                    venta_has_modo_pago vmp 
                        left  JOIN tarjeta t ON vmp.fk_tarjeta = t.idtarjeta
                        
                        LEFT JOIN banco  b ON b.idbanco = vmp.banco_idbanco 
                    WHERE vmp.venta_idventa = ${idventa};`,(err,rows)=>{
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
    lista_ventas_admin,
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
    desc_cantidades_stock_venta,
    inc_cantidades_stock_venta,
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