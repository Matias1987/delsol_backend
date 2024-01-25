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

module.exports = {obtener_operaciones, obtener_caja_dia_sucursal, obtener_resumen_totales}