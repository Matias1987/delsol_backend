const { parse_date_for_mysql } = require("../lib/helpers");
const mysql_connection = require("../lib/mysql_connection");
const venta_queries = require("./queries/ventaQueries");

const lista_ventas_admin = (callback) => {
    const query = `SELECT
    CONCAT(c.apellido,' ', c.nombre) AS 'cliente',
    u.nombre AS 'vendedor', 
    v.idventa, 
    v.monto_total,
    s.nombre as 'sucursal',
    s.color,
    v.estado
    FROM cliente c, usuario u, venta v, sucursal s 
    WHERE 
    /*date(v.fecha) = date(now()) and */
    v.cliente_idcliente = c.idcliente AND 
    v.usuario_idusuario = u.idusuario AND 
    v.sucursal_idsucursal = s.idsucursal ORDER BY v.fecha desc;`
    
    const connection = mysql_connection.getConnection()

    connection.connect()
   // console.log("query ventas admin")
    connection.query(query,(err,rows)=>{
        //console.log(JSON.stringify(rows))
        callback(rows)
    })

    connection.end()
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
    /**
     * if estado==entregado, update fecha_retiro
     */
    console.log("FECHA RETIRO: " + data.fecha_retiro)
    const fr = typeof data.fecha_retiro === 'undefined' ? "": data.fecha_retiro

    const __t = (data.estado=="ENTREGADO" ? `, v.fecha_retiro='${fr}' `: "")
    
    connection.query(`UPDATE venta v SET v.estado = '${data.estado}' ${__t} WHERE v.idventa=${data.idventa};`,(err,results)=>{
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

    const __now = new Date();

    if(data.fechaRetiro == null){
        data.fechaRetiro = `${__now.getDate()}-${__now.getMonth()}-${__now.getFullYear()}`;//parse_date_for_mysql(`${__now.getDate()}-${__now.getMonth()}-${__now.getFullYear()}` )
    }

    const do_push = (orden,arr,val,tipo,descontable) => (val||0) === 0 ? arr : (val.codigo == null || val.idcodigo<0 ? arr : [...arr,{...val,tipo:tipo, orden: orden, descontable: descontable}]) 

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
            ${typeof e.descontable === 'undefined'? 1 : e.descontable },
            ${typeof e.curva_base === 'undefined'? 0 : e.curva_base },
            ${typeof e.diametro === 'undefined'? 0 : e.diametro }
            )`
        })
        return _str;
    }

    const prepare_venta_directa_items = (__data) => {
        _arr_items = __data.productos;
    }

    const prepare_lclab_items = (__data) => {
        _arr_items = do_push(1,_arr_items,__data.productos.oi, "oi",1)
        _arr_items = do_push(0,_arr_items,__data.productos.od, "od",1)
        _arr_items = do_push(2,_arr_items,__data.productos.insumo, "insumo",1)
    }

    const prepare_lclstock_items = (__data) => {
        _arr_items = do_push(1,_arr_items,__data.productos.oi, "oi",1)
        _arr_items = do_push(0,_arr_items,__data.productos.od, "od",1)
        _arr_items = do_push(2,_arr_items,__data.productos.insumo, "insumo",1)

    }

    const prepare_monoflab_items = (__data) => {
        _arr_items = do_push(2,_arr_items,__data.productos.lejos_armazon,"lejos_armazon",1)
        _arr_items = do_push(0,_arr_items,__data.productos.lejos_od,"lejos_od",1)
        _arr_items = do_push(1,_arr_items,__data.productos.lejos_oi,"lejos_oi",1)
        _arr_items = do_push(3,_arr_items,__data.productos.lejos_tratamiento,"lejos_tratamiento",1)
        _arr_items = do_push(6,_arr_items,__data.productos.cerca_armazon,"cerca_armazon",1)
        _arr_items = do_push(4,_arr_items,__data.productos.cerca_od,"cerca_od",1)
        _arr_items = do_push(5,_arr_items,__data.productos.cerca_oi,"cerca_oi",1)
        _arr_items = do_push(7,_arr_items,__data.productos.cerca_tratamiento,"cerca_tratamiento",1)
    }

    const prepare_multiflab_items = (__data) => {
        _arr_items = do_push(2,_arr_items,__data.productos.armazon,"armazon",1)
        _arr_items = do_push(0,_arr_items,__data.productos.od,"od",1)
        _arr_items = do_push(1,_arr_items,__data.productos.oi,"oi",1)
        _arr_items = do_push(3,_arr_items,__data.productos.tratamiento,"tratamiento",1)
    }

    const prepare_recstock_items = (__data) => {
        _arr_items = do_push(2,_arr_items,__data.productos.lejos_armazon,"lejos_armazon",1)
        _arr_items = do_push(0,_arr_items,__data.productos.lejos_od,"lejos_od",1)
        _arr_items = do_push(1,_arr_items,__data.productos.lejos_oi,"lejos_oi",1)
        _arr_items = do_push(3,_arr_items,__data.productos.lejos_tratamiento,"lejos_tratamiento",1)

        _arr_items = do_push(6,_arr_items,__data.productos.cerca_armazon,"cerca_armazon",1)
        _arr_items = do_push(4,_arr_items,__data.productos.cerca_od,"cerca_od",1)
        _arr_items = do_push(5,_arr_items,__data.productos.cerca_oi,"cerca_oi",1)
        _arr_items = do_push(7,_arr_items,__data.productos.cerca_tratamiento,"cerca_tratamiento",1)
    }


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
                '${p.modo_pago}',
                '${p.tarjeta_nro}'
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
        (typeof data.en_laboratorio === 'undefined'? "" : data.en_laboratorio),
        (typeof data.fecha === 'undefined'? "" : data.fecha)
           
       
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
        (typeof data.en_laboratorio === 'undefined'? "" : data.en_laboratorio),
        (typeof data.fecha === 'undefined'? "" : data.fecha)
           
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

const obtener_datos_pagare = (data,callback) => {
    /**
     * AGREGAR pagare_impreso en tabla venta_has_modo_pago
     */
    console.log("obteniendo detalles venta: " + data)
    const query_mp_ctacte = `SELECT 
    vmp.id_modopago,
    v.idventa,
    v.cliente_idcliente,
    vmp.monto,
    vmp.monto_int,
    vmp.cant_cuotas,
    vmp.monto_cuota,
    v.monto_total AS 'vta_monto'
     FROM 
    venta_has_modo_pago vmp, 
    venta v 
    WHERE v.idventa = ${data} AND 
    vmp.venta_idventa = v.idventa AND 
    vmp.modo_pago = 'ctacte';`

    /**
    get list of 'modopago', because pagos are not done yet, so the only way of 
    gessing the amount that the client paid, is by getting the list of 'modopago'...
    */
    const query_mp = `SELECT sum(vmp.monto) as 'monto_sum' FROM venta_has_modo_pago vmp 
    WHERE vmp.venta_idventa = ${data}
    AND vmp.modo_pago <> 'ctacte';`

    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query_mp_ctacte,(err,rows)=>{
        if(rows.length<1)
        {
            /** no record found */
            callback({err:-1});
        }
        else
        {
            const r = rows[0]
            //console.log(query_mp)
            connection.query(query_mp,(_err, _rows)=>{
                var monto_entrega=0;
                console.log(JSON.stringify(_rows))
                if(_rows.length>0)
                {
                    //entrega found
                    monto_entrega = parseFloat(_rows[0].monto_sum)
                }
                callback({
                    idventa: r.idventa,
                    idcliente: r.cliente_idcliente,
                    monto: r.monto,//monto mp cta cte sin interes
                    monto_int: r.monto_int, //monto mp cta cte con interes
                    cant_cuotas: r.cant_cuotas,
                    monto_cuota: r.monto_cuota,
                    monto_entrega: monto_entrega,
                    vta_monto: r.vta_monto,
                    vta_monto_int: parseFloat(r.vta_monto) - r.monto + r.monto_int,
                })
            })
        }
        connection.end()
    })
    
}

const obtener_lista_pagares = (data,callback) => {
    const query = `SELECT v.idventa , vhmp.monto_int AS 'monto', DATE_FORMAT(v.fecha, '%d-%m-%y') AS 'fecha'
    FROM venta v, venta_has_modo_pago vhmp WHERE vhmp.modo_pago = 'ctacte' 
    AND vhmp.venta_idventa=v.idventa AND v.cliente_idcliente = ${data} order by v.idventa desc;`;
    const connection = mysql_connection.getConnection();
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const obtener_categorias_productos_venta = (data, callback) => {
    const query = `SELECT distinct * FROM 
    (
        SELECT f.nombre_largo FROM venta_has_stock vhs,  codigo c, subgrupo sg, grupo g, subfamilia sf, familia f
            WHERE 
                    vhs.stock_codigo_idcodigo = c.idcodigo and
            c.subgrupo_idsubgrupo = sg.idsubgrupo and
            sg.grupo_idgrupo = g.idgrupo AND 
            g.subfamilia_idsubfamilia = sf.idsubfamilia and
            sf.familia_idfamilia = f.idfamilia AND 
            vhs.venta_idventa=${data}
    ) AS t`;

    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
    
}



module.exports = {
    lista_ventas_admin,
    insert_venta,
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
    obtener_datos_pagare,
    obtener_lista_pagares,
    obtener_categorias_productos_venta,
}

