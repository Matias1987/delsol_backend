const mysql_connection = require("../lib/mysql_connection")

const obtener_caja_dia_sucursal = (data, callback) => {
    const query = `SELECT c.idcaja FROM caja c WHERE date(c.fecha) = DATE('${data.anio}/${data.mes}/${data.dia}') AND c.sucursal_idsucursal=${data.idsucursal};`;
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

const obtener_resumen_cobros = (idcaja, callback) => {
    const query = `SELECT 
    SUM(if(ops.modo_pago = 'efectivo',ops.monto,0)) AS 'efectivo',
    SUM(if(ops.modo_pago = 'tarjeta',ops.monto,0)) AS 'tarjeta',
    SUM(if(ops.modo_pago = 'mutual',ops.monto,0)) AS 'mutual',
    SUM(if(ops.modo_pago = 'cheque',ops.monto,0)) AS 'cheque',
    SUM(if(ops.modo_pago = 'ctacte',ops.monto,0)) AS 'cuotas',
    SUM(if(ops.modo_pago = 'cuota',ops.monto,0)) AS 'ctacte'
    from
    (
            SELECT 
            replace(format(chmp.monto,2),',','') as 'monto',
            if(chmp.modo_pago='efectivo','ctacte',chmp.modo_pago) AS 'modo_pago'
            FROM 
            cobro_has_modo_pago chmp,
            cobro c,
            cliente cl
            WHERE 
            c.cliente_idcliente = cl.idcliente AND 
            chmp.cobro_idcobro = c.idcobro AND
            c.caja_idcaja=${idcaja} AND 
            c.tipo='cuota'
        UNION
            SELECT 
            replace(format(chmp.monto,2),',','') as 'monto',
            chmp.modo_pago
            FROM 
            cobro_has_modo_pago chmp,
            cobro c,
            cliente cl
            WHERE 
            c.cliente_idcliente = cl.idcliente AND 
            chmp.cobro_idcobro = c.idcobro AND
            c.caja_idcaja=${idcaja} AND 
            c.tipo <> 'cuota' AND 
            chmp.modo_pago <> 'ctacte'
        UNION
            SELECT 
            replace(format(vhmp.monto_int,2),',','') as  'monto' ,
            'cuota' AS 'modo_pago'
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

module.exports = {obtener_operaciones, obtener_caja_dia_sucursal, obtener_resumen_cobros}