const { parse_date_for_mysql } = require("../lib/helpers");
const mysql_connection = require("../lib/mysql_connection");
const { obtenerCajaAbierta } = require("./queries/cajaQueries");
const { insertEvento } = require("./queries/eventoQueries");
const venta_queries = require("./queries/ventaQueries");

const cambiar_responsable = (data, callback) => {
    const query = `UPDATE venta v  SET v.cliente_idcliente = ${data.idresponsable} WHERE v.idventa=${data.idventa};`
    
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)

    })
    connection.end()

}

const cambiar_destinatario = (data, callback) => {
    const query = `UPDATE venta v SET v.fk_destinatario = ${data.iddestinatario} WHERE v.idventa=${data.idventa};`
    
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)

    })
    connection.end()
}

const lista_ventas_sucursal_mes = (data,callback) => {
    const query = `SELECT s.nombre AS 'sucursal', t.* FROM 
    sucursal s,
    (
        SELECT 
            v.sucursal_idsucursal,
            sum(if(vmp.modo_pago='efectivo',vmp.monto,0)) AS 'efectivo',
            sum(if(vmp.modo_pago='tarjeta',vmp.monto,0)) AS 'tarjeta',
            sum(if(vmp.modo_pago='cheque',vmp.monto,0)) AS 'cheque',
            sum(if(vmp.modo_pago='ctacte',vmp.monto,0)) AS 'ctacte',
            sum(if(vmp.modo_pago='mutual',vmp.monto,0)) AS 'mutual',
            sum(if(vmp.modo_pago='mercadopago',vmp.monto,0)) AS 'mp',
            SUM(vmp.monto) AS 'total'
        FROM 
            venta_has_modo_pago vmp, venta v 
        WHERE
            vmp.venta_idventa = v.idventa AND 
            YEAR(v.fecha_retiro) = ${data.anio} AND 
            MONTH(v.fecha_retiro) = ${data.mes} AND 
            v.estado = 'ENTREGADO' 
            GROUP BY v.sucursal_idsucursal
            
    ) AS t
    WHERE 
    t.sucursal_idsucursal = s.idsucursal;`

    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()


}

const lista_ventas_vendedor_mes = (data, callback) => {
    const query = `SELECT 
    v.idventa, 
    DATE_FORMAT(v.fecha_retiro,'%d-%m-%y') AS 'fecha_retiro',
    CONCAT(c.apellido,', ',c.nombre) AS 'cliente',
    v.monto_total
    FROM 
    venta v, cliente c 
    WHERE 
    v.cliente_idcliente = c.idcliente AND 
    YEAR(v.fecha_retiro) = 2023 AND 
    MONTH(v.fecha_retiro) = 12 AND 
    v.estado='ENTREGADO' AND 
    v.usuario_idusuario=0;`;

    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const totales_venta_vendedor = (data,callback) => {
    
    const fkvendedor = typeof data.fkvendedor === 'undefined' ? '-1' : data.fkvendedor;
    const fksucursal = typeof data.fksucursal === 'undefined' ? '-1' : data.fksucursal;
    const query = `SELECT u.nombre AS 'usuario', t.* FROM 
    usuario u,
    (
        SELECT 
            v.usuario_idusuario,
            sum(if(vmp.modo_pago='efectivo',vmp.monto,0)) AS 'efectivo',
            sum(if(vmp.modo_pago='tarjeta',vmp.monto,0)) AS 'tarjeta',
            sum(if(vmp.modo_pago='cheque',vmp.monto,0)) AS 'cheque',
            sum(if(vmp.modo_pago='ctacte',vmp.monto,0)) AS 'ctacte',
            sum(if(vmp.modo_pago='mutual',vmp.monto,0)) AS 'mutual',
            sum(if(vmp.modo_pago='mercadopago',vmp.monto,0)) AS 'mp',
            SUM(vmp.monto) AS 'total'
        FROM 
            venta_has_modo_pago vmp, venta v 
        WHERE
            vmp.venta_idventa = v.idventa AND 
            YEAR(v.fecha_retiro) = ${data.anio} AND 
            MONTH(v.fecha_retiro) = ${data.mes} AND 
            v.estado = 'ENTREGADO' AND
            (case when '${fkvendedor}'<>'-1' then ${fkvendedor} = v.usuario_idusuario else true end) and  
            (case when '${fksucursal}'<>'-1' then ${fksucursal} = v.sucursal_idsucursal else true end)
            GROUP BY v.usuario_idusuario
            
    ) AS t
    WHERE 
    t.usuario_idusuario = u.idusuario;`

  
    const  connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

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
   
    connection.query(query,(err,rows)=>{
        
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
    /*const query = `UPDATE stock s, 
    (
        SELECT 
        vhs.idventaitem,
        vhs.stock_sucursal_idsucursal AS 'idsucursal',
        vhs.stock_codigo_idcodigo AS 'idcodigo', 
        vhs.cantidad 
        FROM venta_has_stock vhs WHERE vhs.venta_idventa=${data.idventa}  AND vhs.descontable=1
    ) AS vs
    SET s.cantidad = s.cantidad - vs.cantidad WHERE
    s.codigo_idcodigo = vs.idcodigo AND 
    s.sucursal_idsucursal = vs.idsucursal;`*/
    
    ///FALTA LA SUCURSAL!!!!!!!
    
    const query = `update stock s,
    (
            SELECT 
                vhs.stock_codigo_idcodigo AS 'idcodigo', 
                sum(vhs.cantidad) AS 'cantidad' 
            FROM venta_has_stock vhs 
                  WHERE vhs.venta_idventa= ${data.idventa} 
                  AND vhs.descontable=1
                  GROUP BY vhs.stock_codigo_idcodigo
    ) AS vs
    SET s.cantidad = s.cantidad - vs.cantidad
    where
    vs.idcodigo = s.codigo_idcodigo AND 
    s.sucursal_idsucursal=${data.idsucursal}
    ;`

    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        
        callback(resp)
    })
    connection.end();
    
}
const inc_cantidades_stock_venta = (data,callback) =>
{
    const query = `update stock s,
    (
            SELECT 
                vhs.stock_codigo_idcodigo AS 'idcodigo', 
                sum(vhs.cantidad) AS 'cantidad' 
            FROM venta_has_stock vhs 
                  WHERE vhs.venta_idventa= ${data.idventa} 
                  AND vhs.descontable=1
                  GROUP BY vhs.stock_codigo_idcodigo
    ) AS vs
    SET s.cantidad = s.cantidad + vs.cantidad
    where
    vs.idcodigo = s.codigo_idcodigo AND 
    s.sucursal_idsucursal=${data.idsucursal}`
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
    const fr = typeof data.fecha_retiro === 'undefined' ? "": data.fecha_retiro

    const __t = (data.estado=="ENTREGADO" ? `, v.fecha_retiro='${fr}' `: "")

    const en_laboratorio =  (data.estado=="PENDIENTE") ? 1 : 0

    const estado_laboratorio = en_laboratorio ? 'PENDIENTE' : ''
    
   

    const query = `UPDATE venta v SET v.estado = '${data.estado}' ${__t}, v.en_laboratorio=if(v.tipo=1,0, ${en_laboratorio}), v.estado_taller='${estado_laboratorio}' WHERE v.idventa=${data.idventa};`

    connection.query(query,(err,results)=>{
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
    const estado_laboratorio = +en_laboratorio==1 ? 'PENDIENTE' : ''
    
    connection.query(`UPDATE venta v SET v.en_laboratorio = ${en_laboratorio}, v.estado_taller='${estado_laboratorio}'  WHERE v.idventa=${idventa};`, (err,resp)=>{
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
            ${typeof e.cb === 'undefined'? 0 : e.cb },
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
   

     const connection = mysql_connection.getConnection();
    connection.connect();
    //check quantities
   
    //get caja!
    //console.log("Obteniendo caja...")
    connection.query(obtenerCajaAbierta(data.fksucursal),(err,_rows)=>{
        if(_rows.length<1)
        {
            console.log("No hay caja!!!!!")
            connection.query(insertEvento("NULL CAJA (CLIENTE REF)",data.fkusuario,data.fksucursal,data.fkcliente,"VENTA"))
            callback(null)
            connection.end()
            return
        }
        else{
            if(_rows[0].idcaja!=data.fkcaja)
            {
                console.log("<!> el nro de caja obtenida en el servidor no coincide con el recibido del cliente... ")
                connection.query(insertEvento("CAJA ID MISMATCH (CLIENTE REF)",data.fkusuario,data.fksucursal,data.fkcliente,"VENTA"))
            }
            const idcaja=_rows[0].idcaja
            //#region save dependent data
            //console.log("###################################");
            //console.log(venta_queries.venta_insert_query(venta_queries.parse_venta_data(data)));
            //console.log("###################################");

            connection.query(venta_queries.venta_insert_query(venta_queries.parse_venta_data(data),idcaja),
            (err,resp) => {
                venta_id = parseInt(resp.insertId);
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
        
                if(mp.length>0)
                {
                connection.query(venta_queries.query_mp + mp, (err,_resp)=>{
                    
                    connection.query(venta_queries.query_items + _items_data,(err,__resp)=>{
        
                        callback(venta_id)
        
                        connection.end();
                    })
                })
                }
                else{
                    if(_arr_items.length>0){
                        connection.query(venta_queries.query_items + _items_data,(err,__resp)=>{
        
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
            //#endregion
        }

    })
    
}



const detalle_venta = (idventa,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    
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
    
    connection.query(
        venta_queries.queryListaVentasSucursalEstado(
        (typeof data.idsucursal === 'undefined' ? "" : data.idsucursal),
        (typeof data.estado === 'undefined' ? "" : data.estado),
        (typeof data.tipo === 'undefined' ? "" : data.tipo),
        (typeof data.idmedico === 'undefined' ? "" : data.idmedico),
        (typeof data.iddestinatario === 'undefined' ? "" : data.iddestinatario),
        (typeof data.idcliente === 'undefined' ? "" : data.idcliente),
        (typeof data.id === 'undefined' ? "" : data.id),
        (typeof data.en_laboratorio === 'undefined'? "" : data.en_laboratorio),
        (typeof data.fecha === 'undefined'? "" : data.fecha),
        (typeof data.idusuario === 'undefined' ? "" : data.idusuario),
        (typeof data.estado_taller === 'undefined' ? "" : data.estado_taller),
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
    v.estado <> 'ANULADO' AND 
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
            
            connection.query(query_mp,(_err, _rows)=>{
                var monto_entrega=0;
                
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
    FROM venta v, venta_has_modo_pago vhmp WHERE 
    vhmp.modo_pago = 'ctacte'  AND 
    vhmp.venta_idventa=v.idventa AND 
    v.estado <> 'ANULADO' AND 
    v.cliente_idcliente = ${data} 
    order by v.idventa desc;`;
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

const obtener_ventas_subgrupo = (data, callback) => {
    const connection = mysql_connection.getConnection()
    const query = `
    SELECT * FROM 
    (
        SELECT 
        ${data.idsubgrupo} as 'subgrupo_idsubgrupo',
        c.idcodigo,
        c.codigo ,   
        0 as 'stock_ideal',
        CAST(REPLACE(  REGEXP_SUBSTR(c.codigo, 'ESF[\+\-\.0-9]+'), 'ESF', '') AS DECIMAL(10,2)) AS 'esf_dec' ,
        CAST(REPLACE(  REGEXP_SUBSTR(c.codigo, 'CIL[\+\-\.0-9]+'), 'CIL', '') AS DECIMAL(10,2)) AS 'cil_dec' ,
        CAST(REPLACE(  REGEXP_SUBSTR(c.codigo, 'EJE[\+\-\.0-9]+'), 'EJE', '') AS DECIMAL(10,2)) AS 'eje_dec' ,
        REPLACE(  REGEXP_SUBSTR(c.codigo, 'ESF[\+\-\.0-9]+'), 'ESF', '')  AS 'esf',  
        REPLACE(  REGEXP_SUBSTR(c.codigo, 'CIL[\+\-\.0-9]+'), 'CIL', '')  AS 'cil',
        REPLACE(  REGEXP_SUBSTR(c.codigo, 'EJE[\+\-\.0-9]+'), 'EJE', '')  AS 'eje',  
        if( cant.stock_codigo_idcodigo IS NULL , 0 , cant.cant  ) AS 'cantidad'
        FROM 
            (
                SELECT _c.codigo, _c.idcodigo FROM codigo _c WHERE _c.subgrupo_idsubgrupo = ${data.idsubgrupo}
            ) c
        LEFT JOIN 
            (
                SELECT 
                    COUNT(vhs.stock_codigo_idcodigo) AS 'cant',
                    vhs.stock_codigo_idcodigo
                FROM 
                    venta v, venta_has_stock vhs 
                WHERE 
                    vhs.venta_idventa=v.idventa AND 
                    DATE(v.fecha)>=DATE('${data.desde}') AND
                    DATE(v.fecha)<=DATE('${data.hasta}') 
                    GROUP BY vhs.stock_codigo_idcodigo
            ) cant
            on c.idcodigo = cant.stock_codigo_idcodigo
            WHERE 
            (case when '${data.eje}'<>'-1' then '${data.eje}' = REPLACE(  REGEXP_SUBSTR(c.codigo, 'EJE[\+\-\.0-9]+'), 'EJE', '') else true end)
        ) AS __c
    ORDER BY
    __c.esf, __c.cil, __c.eje
    ;
    `;
    //console.log(query)
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}


module.exports = {
    
    obtener_ventas_subgrupo,
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
    totales_venta_vendedor,
    lista_ventas_vendedor_mes,
    lista_ventas_sucursal_mes,
    cambiar_responsable,
    cambiar_destinatario,
}

