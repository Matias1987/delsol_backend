const mysql_connection = require("../lib/mysql_connection")


const total_general_gastos = (data, callback) => {
    const query = `SELECT 
                    SUM(if(periodo='dia',gs.monto, 0 )) AS 'monto_dia',
                    SUM(if(periodo='dia',gs.cant, 0 )) AS 'cant_dia',
                    SUM(if(periodo='mes',gs.monto, 0 )) AS 'monto_mes',
                    SUM(if(periodo='mes',gs.cant, 0 )) AS 'cant_mes'
                    FROM 
                    (
                        SELECT 'dia' AS 'periodo', COUNT(g.idgasto) AS 'cant', SUM(g.monto) AS 'monto' FROM gasto g WHERE DATE(g.fecha) = DATE(NOW()) AND g.anulado=0
                        union
                        SELECT 'mes' AS 'periodo', COUNT(g.idgasto) AS 'cant', SUM(g.monto) AS 'monto' FROM gasto g WHERE MONTH(g.fecha)=MONTH(NOW()) AND YEAR(g.fecha) = YEAR(NOW())
                    )gs`;
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query, (err, response) => {
        if (err) {
            return callback({ err: 1 })
        }

        return callback(response);
    })
    connection.end();
}

const total_general_cobros = (data, callback) => {
    const query = `SELECT 
                    SUM(if(cs.periodo='dia',cs.monto, 0 )) AS 'monto_dia',
                    SUM(if(cs.periodo='dia',cs.cant, 0 )) AS 'cant_dia',
                    SUM(if(cs.periodo='mes',cs.monto, 0 )) AS 'monto_mes',
                    SUM(if(cs.periodo='mes',cs.cant, 0 )) AS 'cant_mes'
                    FROM 
                    (
                    SELECT 'dia' AS 'periodo', COUNT(c.idcobro) AS 'cant', SUM(c.monto) AS 'monto' FROM cobro c WHERE c.anulado=0 AND DATE(c.fecha) = DATE(NOW())
                    UNION 
                    SELECT 'mes' AS 'periodo', COUNT(c.idcobro) AS 'cant', SUM(c.monto) AS 'monto' FROM cobro c WHERE c.anulado=0 AND YEAR(c.fecha) = YEAR(NOW()) AND MONTH(c.fecha) = MONTH(NOW())
                    )cs;`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query, (err, response) => {
        if (err) {
            return callback({ err: 1 })
        }

        return callback(response);
    })
    connection.end();
}

const obtener_caja_dia_sucursal = (data, callback) => {
    const query = `SELECT c.idcaja FROM caja c WHERE date(c.fecha) = DATE('${data.anio}/${data.mes}/${data.dia}') AND c.sucursal_idsucursal=${data.idsucursal};`;
    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query, (err, rows) => {
        if (rows != null) {
            if (rows.length > 0) {
                callback(rows[0])
            }
            else {
                callback(null)
            }
        }
        else {
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
    sum(if(ops.modo_pago = 'mercadopago',ops.monto,0)) AS 'mercadopago',
    sum(if(ops.modo_pago = 'transferencia',ops.monto,0)) AS 'transferencia'
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
    connection.query(query, (err, rows) => {
        if (rows != null) {
            callback(rows)
        }
        else {
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


const obtener_totales_vendedores_dia = (data, callback) => {
    const idsucursal = data?.idsucursal || "-1"
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
    connection.query(query, (err, rows) => {
        callback(rows)
    })
    connection.end()
}

const obtener_ventas_dia_vendedor = (data, callback) => {
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
    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query, (err, rows) => {
        callback(rows)
    })
    connection.end()
}

const ventas_dia_totales = (data, callback) => {
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
    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query, (err, rows) => {
        callback(rows)
    })
    connection.end()
}


const totales_stock_ventas_periodo = (data, callback) => {

    let { desde, hasta, idsucursal, codigo, cat, idcategoria } = data
    let idfamilia = cat != 'familia' ? -1 : idcategoria;
    let idsubfamilia = cat != 'subfamilia' ? -1 : idcategoria;
    let idgrupo = cat != 'grupo' ? -1 : idcategoria;
    let idsubgrupo = cat != 'subgrupo' ? -1 : idcategoria;
    const query = `
            SELECT 
                sc.nombre as sucursal,
                cod.codigo,
                cod.descripcion,
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
    connection.query(query, (err, rows) => {
        callback(rows)
    })
    connection.end()

}

const lista_ventas_sucursal_periodo = (data, callback) => {
    const query = `
    SELECT 
	 v.idventa,
	 CONCAT(c.apellido, ' ', c.nombre) AS 'cliente',
	 u.nombre AS 'vendedor',
	 replace(format(v.monto_total,2),',','') AS 'monto',
     DATE_FORMAT(v.fecha_retiro,'%d-%m-%y') AS 'fecha_retiro_f'
    FROM 
    venta v, 
    cliente c,
    usuario u
    WHERE
    c.idcliente = v.cliente_idcliente AND 
    v.usuario_idusuario = u.idusuario AND  
    v.estado='ENTREGADO' AND 
    (case when '${data.fksucursal}'<>'-1' then v.sucursal_idsucursal = ${data.fksucursal} else true end) AND
    (case when '${data.fkusuario}'<>'-1' then v.usuario_idusuario = ${data.fkusuario} else true end) AND 
    DATE(v.fecha_retiro)>=DATE( CONCAT(${data.anio},'-',${data.mes},'-1')) AND 
    DATE(v.fecha_retiro)<= DATE_ADD( DATE_ADD(DATE( CONCAT(${data.anio},'-',${data.mes},'-1')), INTERVAL 1 MONTH), INTERVAL -1 DAY)
    ;`
    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query, (err, resp) => {
        callback(resp)
    })
    connection.end()

}


const total_tarjetas_periodo = (data, callback) => {
    const query = `SELECT 
                    o.idtarjeta,
                    o.tarjeta,
                    SUM(o.monto) AS 'monto'
                    FROM
                    (
                        SELECT 
                        t.nombre AS 'tarjeta', 
                        t.idtarjeta,
                        cmp.monto 
                        FROM 
                        cobro_has_modo_pago cmp INNER JOIN tarjeta t ON t.idtarjeta=cmp.fk_tarjeta 
                        WHERE cmp.modo_pago='tarjeta' AND 
                        cmp.cobro_idcobro in
                        (
                            SELECT c.idcobro FROM cobro c WHERE 
                            (case when ''<>'' then c.fecha > DATE('1970-01-01') ELSE TRUE END ) AND 
                            (case when ''<>'' then c.fecha < DATE('2026-01-01') ELSE TRUE END ) AND 
                            (case when ''<>'' then c.sucursal_idsucursal = 1 ELSE TRUE END) AND 
                            c.anulado=0
                        )
                    ) o
                    GROUP BY o.idtarjeta
                    ;`
}

module.exports = {
    lista_ventas_sucursal_periodo,
    ventas_dia_totales,
    obtener_operaciones,
    obtener_caja_dia_sucursal,
    obtener_resumen_totales,
    obtener_totales_vendedores_dia,
    obtener_ventas_dia_vendedor,
    totales_stock_ventas_periodo,
    total_general_cobros,
    total_general_gastos,
    total_tarjetas_periodo,
}