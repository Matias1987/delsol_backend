const mysql_connection = require("../lib/mysql_connection")



const obtener_caja_dia_sucursal = (data, callback) => {
    const query = `SELECT c.idcaja FROM caja c WHERE date(c.fecha) = DATE('${data.anio}/${data.mes}/${data.dia}') AND c.sucursal_idsucursal=${data.idsucursal};`;
    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        if(rows!=null)
        {
            if(rows.length>0)
            {
                callback(rows[0])
            }
            else{
                callback(null)
            }
        }
        else{
            callback(null)
        }
       
    })
    connection.end()
}

const obtener_resumen_totales = (idcaja, callback) => {
    const query = `SELECT 
    sum(if(ops.modo_pago = 'efectivo',ops.monto,0)) AS 'efectivo',
    sum(if(ops.modo_pago = 'tarjeta',ops.monto,0)) AS 'tarjeta',
    sum(if(ops.modo_pago = 'mutual',ops.monto,0)) AS 'mutual',
    sum(if(ops.modo_pago = 'cheque',ops.monto,0)) AS 'cheque',
    sum(if(ops.modo_pago = 'ctacte',ops.monto,0)) AS 'cuotas',
    sum(if(ops.modo_pago = 'cuota',ops.monto,0)) AS 'ctacte',
    sum(if(ops.modo_pago = 'total',ops.monto,0)) AS 'monto_total',
    sum(if(ops.modo_pago = 'ANULADO',ops.monto,0)) AS 'anulado',
    sum(if(ops.modo_pago = 'mercadopago',ops.monto,0)) AS 'mercadopago'
    from
    (
            SELECT 
            1 AS 'monto' ,
            'ANULADO' AS 'modo_pago',
            'ANULADO' AS 'operacion',
            '-' AS 'cliente',
            0 AS 'recibo',
            '-' AS 'detalle'
            FROM venta v 
            WHERE 
            v.estado='ANULADO' AND 
            v.caja_idcaja= ${idcaja}
        UNION
            SELECT 
            v.monto_total AS 'monto' ,
            'total' AS 'modo_pago',
            'total' AS 'operacion',
            '-' AS 'cliente',
            0 AS 'recibo',
            '-' AS 'detalle'
            FROM 
            venta v, caja c WHERE 
            c.idcaja=${idcaja} AND 
            v.sucursal_idsucursal = c.sucursal_idsucursal AND 
            month(v.fecha_retiro) = month(NOW()) AND 
            YEAR(v.fecha_retiro) = YEAR(NOW()) AND 
            v.estado='ENTREGADO'
        UNION
            SELECT 
            replace(format(chmp.monto,2),',','') as 'monto',
            if(chmp.modo_pago='efectivo','ctacte',chmp.modo_pago) AS 'modo_pago',
            c.venta_idventa AS 'operacion',
            CONCAT(cl.apellido,' ', cl.nombre) AS 'cliente',
            chmp.cobro_idcobro AS 'recibo',
            'PAGO CUOTA' as 'detalle'
            FROM 
            cobro_has_modo_pago chmp,
            cobro c,
            cliente cl
            WHERE 
            c.cliente_idcliente = cl.idcliente AND 
            chmp.cobro_idcobro = c.idcobro AND
            c.caja_idcaja=${idcaja} AND 
            c.tipo='cuota' and 
            c.anulado=0
        UNION
            SELECT 
            replace(format(chmp.monto,2),',','') as 'monto',
            chmp.modo_pago,
            c.venta_idventa AS 'operacion',
            CONCAT(cl.apellido,' ', cl.nombre) AS 'cliente',
            chmp.cobro_idcobro AS 'recibo',
            'CIERRE OP.' as 'detalle'
            FROM 
            cobro_has_modo_pago chmp,
            cobro c,
            cliente cl
            WHERE 
            c.cliente_idcliente = cl.idcliente AND 
            chmp.cobro_idcobro = c.idcobro AND
            c.caja_idcaja=${idcaja} AND 
            c.tipo <> 'cuota' AND 
            chmp.modo_pago <> 'ctacte' and
            c.anulado=0
        UNION
            SELECT 
            replace(format(vhmp.monto_int,2),',','') as  'monto' ,
            'cuota' AS 'modo_pago',
            vhmp.venta_idventa AS 'operacion',
            CONCAT(cl.apellido,' ', cl.nombre) AS 'cliente',
            '' AS 'recibo',
            'PAGO EN CTA. CTE.' as 'detalle'
            FROM 
            venta_has_modo_pago vhmp,
            venta v,
            caja c,
            cliente cl
            WHERE 
            c.idcaja=${idcaja} AND 
            v.sucursal_idsucursal = c.sucursal_idsucursal AND 
            v.estado='ENTREGADO' AND
            v.cliente_idcliente = cl.idcliente AND 
            vhmp.modo_pago = 'ctacte' AND 
            vhmp.venta_idventa = v.idventa AND 
            DATE(v.fecha_retiro) = DATE(c.fecha)
    ) AS ops;`

    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        if(rows!=null)
        {
            callback(rows)
        }
        else{
            callback([])
        }
    })
    connection.end()
}

const obtener_operaciones = (idsucursal, callback) => {
    const query = `
    SELECT 'VENTAS_MONTO' AS 'tipo', SUM(v.monto_total) AS 'monto' FROM venta v WHERE DATE(v.fecha)=DATE(NOW()) AND v.estado<>'ANULADO'
    union
    SELECT 'VENTAS_CANT' AS 'tipo', COUNT(v.idventa) AS 'monto' FROM venta v WHERE DATE(v.fecha)=DATE(NOW()) AND v.estado<>'ANULADO'
    union
    SELECT 'ANULADO' AS 'tipo', COUNT(v.idventa) AS 'monto' FROM venta v WHERE DATE(v.fecha)=DATE(NOW()) AND v.estado='ANULADO'
    union
    SELECT 'GASTO' AS 'tipo', sum(g.monto) AS 'monto' FROM gasto g WHERE DATE(g.fecha) = DATE(NOW())
    union
    SELECT 'EFVO' AS 'tipo', sum(c.monto) AS 'monto' FROM cobro c WHERE DATE(c.fecha) = DATE(NOW()) AND c.tipo = 'efvo'
    union
    SELECT 'CTACTE' AS 'tipo', sum(c.monto) AS 'monto' FROM cobro c WHERE DATE(c.fecha) = DATE(NOW()) AND c.tipo = 'ctacte'
    union
    SELECT 'TARJETA' AS 'tipo', sum(c.monto) AS 'monto' FROM cobro c WHERE DATE(c.fecha) = DATE(NOW()) AND c.tipo = 'tarjeta'
    union
    SELECT 'MUTUAL' AS 'tipo', sum(c.monto) AS 'monto' FROM cobro c WHERE DATE(c.fecha) = DATE(NOW()) AND c.tipo = 'mutual'
    ;`
}


const obtener_totales_vendedores_dia = (data,callback) => {
    const idsucursal = data?.idsucursal||"-1"
    const query = `SELECT 
    u.nombre AS 'usuario',
    SUM(v.monto_total) AS 'monto',  
    v.usuario_idusuario
    FROM 
    venta v , usuario u
    WHERE 
    v.usuario_idusuario = u.idusuario AND 
    date(v.fecha) = date('${data.fecha}') AND 
    (case when '${idsucursal}'<>'-1' then v.sucursal_idsucursal=${idsucursal} ELSE TRUE END) AND
    v.estado <> 'ANULADO' 
    GROUP BY v.usuario_idusuario
    ;
    `

    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const obtener_ventas_dia_vendedor = (data,callback) => 
{
    const query = `SELECT 
    u.nombre AS 'usuario', 
    v.usuario_idusuario
    FROM 
    venta v , usuario u
    WHERE 
    v.usuario_idusuario = u.idusuario AND 
    date(v.fecha) = date('${data.fecha}') AND 
    (case when '${data.idsucursal}'<>'-1' then v.sucursal_idsucursal=${data.idsucursal} ELSE TRUE END) AND 
    v.usuario_idusuario = ${data.idusuario}
    ;
    `
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const ventas_dia_totales = (data,callback) => {
    const query = `SELECT DATE_FORMAT( vs.fecha, '%d-%m-%y') AS 'fecha', vs.cant FROM (
        SELECT DATE(v.fecha) AS 'fecha' , COUNT(v.idventa) AS 'cant'
        FROM venta v 
        WHERE 
        v.usuario_idusuario=${data.idusuario} AND
        date(v.fecha)<=date(now()) and
        date(v.fecha)>=date(date_add(now(), interval -60 day)) and 
        v.estado<>'ANULADO' 
        GROUP BY DATE(v.fecha)
    ) AS vs ORDER BY vs.fecha asc`
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}


const totales_stock_ventas_periodo = (data, callback) => {

    let {desde, hasta, idsucursal, codigo, cat, idcategoria} = data
    let idfamilia = cat!='familia' ? -1 : idcategoria;
    let idsubfamilia = cat!='subfamilia' ? -1 : idcategoria;
    let idgrupo = cat!='grupo' ? -1 : idcategoria;
    let idsubgrupo = cat!='subgrupo' ? -1 : idcategoria;
    const query = `
            SELECT 
                sc.nombre as sucursal,
                cod.codigo,
                cc.cantidad
                from
                (
                    SELECT 
                    vhs.stock_sucursal_idsucursal AS 'idsucursal',
                    vhs.stock_codigo_idcodigo AS 'idcodigo',
                    sum(vhs.cantidad) AS 'cantidad' 
                    FROM 
                        venta v, 
                        venta_has_stock vhs, 
                        codigo c,
                        subgrupo sg, 
                        grupo g, 
                        subfamilia sf,
                        sucursal s
                        WHERE 
                        c.subgrupo_idsubgrupo= sg.idsubgrupo AND 
                        sg.grupo_idgrupo = g.idgrupo AND 
                        g.subfamilia_idsubfamilia = sf.idsubfamilia AND 
                        vhs.stock_codigo_idcodigo = c.idcodigo AND 
                        vhs.venta_idventa=v.idventa AND 
                        DATE(v.fecha)>=DATE('${desde}') AND 
                        DATE(v.fecha)<=DATE('${hasta}') AND 
                        v.estado<>'ANULADO' AND 
                        v.sucursal_idsucursal = s.idsucursal AND 
                        (case when '${idsubgrupo}'<>'-1' then sg.idsubgrupo='${idcategoria}' ELSE TRUE END) AND 
                        (case when '${idgrupo}'<>'-1' then g.idgrupo='${idcategoria}' ELSE TRUE END) AND 
                        (case when '${idsubfamilia}'<>'-1' then sf.idsubfamilia='${idcategoria}' ELSE TRUE END) AND 
                        (case when '${idfamilia}'<>'-1' then sf.familia_idfamilia='${idcategoria}' ELSE TRUE END) AND
                        (case when '${codigo}'<>'' then c.codigo LIKE '%${codigo}%' ELSE TRUE END) AND 
                        (case when '${idsucursal}'<>'-1' then v.sucursal_idsucursal=${idsucursal} ELSE TRUE END)
                        GROUP BY vhs.stock_sucursal_idsucursal, vhs.stock_codigo_idcodigo
                ) as cc,
                sucursal sc,
                codigo cod
                WHERE 
                cc.idsucursal = sc.idsucursal AND 
                cc.idcodigo = cod.idcodigo	 
                order by cc.cantidad desc
                    
                        ;` 

    //console.log(query)

    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query, (err,rows)=>{
        callback(rows)
    })
    connection.end()

}

module.exports = {
    ventas_dia_totales,
    obtener_operaciones, 
    obtener_caja_dia_sucursal, 
    obtener_resumen_totales,
    obtener_totales_vendedores_dia,
    obtener_ventas_dia_vendedor,
    totales_stock_ventas_periodo
}