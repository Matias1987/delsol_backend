const mysql_connection = require("../lib/mysql_connection");

const caja_abierta = (idsucursal,callback) =>{
    const query = `SELECT c.idcaja AND if(date(c.fecha) = DATE(NOW()),1,0) AS 'actual' FROM caja c WHERE c.estado='ABIERTA' AND c.sucursal_idsucursal=${idsucursal};`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        if(rows.length>0)
        {
            callback({abierta:1,current:rows[0].actual == 1 ? 1:0})
        }
        else{
            callback({abierta:0,current:0})
        }
    })
    connection.end()
}

const obtener_lista_cajas_sucursal = (idsucursal, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect()
    connection.query(`SELECT c.*, date_format(c.fecha, '%d-%m-%Y') as 'fecha_f'  FROM caja c WHERE c.sucursal_idsucursal=${idsucursal} ORDER BY c.idcaja desc`,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const cerrarCaja = (idcaja, callback) => {
    const connection = mysql_connection.getConnection();

    connection.connect();

    connection.query(`UPDATE caja c SET c.estado='CERRADO' WHERE c.idcaja=${idcaja}`,(err,resp)=>{
        callback(resp)
    })

    connection.end();
}

const agregarCaja = (data,callback) =>
{
    const connection = mysql_connection.getConnection();

    connection.connect();

    const sql = `insert into caja (sucursal_idsucursal,monto_inicial,estado) values (${data.sucursal_idsucursal},${data.monto_inicial},'${"ABIERTA"}')`
    //values = [[data.sucursal_idsucursal, data.monto_inicial, "ABIERTA"]];
    console.log(sql)

    connection.query(sql,(err,result,fields)=>{
        return callback(result.insertId);
    })

    connection.end();
}

const obtener_caja = (idsucursal, callback) =>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = `SELECT c.*, date_format(c.fecha, '%d-%m-%Y') as 'fecha_f' FROM caja c WHERE c.sucursal_idsucursal=${idsucursal} AND c.estado='ABIERTA';`;
    connection.query(sql,(err,rows)=>{
        
        if(rows.length>0)
        {
            console.log(JSON.stringify(rows))
            callback({...rows[0],status:'OK'})
        }
        else{
            callback({message:'error, no se encontro', status: 'error'})
        }
        
    })
    connection.end();
}

const obtener_caja_id = (idcaja, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = `SELECT c.*,  date_format(c.fecha, '%d-%m-%Y') as 'fecha_f' FROM caja c WHERE c.idcaja=${idcaja};`;
    connection.query(sql,(err,rows)=>{
        
        callback(rows)
        
    })
    connection.end();
}


const informe_caja = (idcaja, callback) =>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = `SELECT 
    ops.monto,
    ops.operacion,
    ops.cliente,
    ops.recibo,
    ops.detalle,
    if(ops.modo_pago = 'efectivo',ops.monto,0) AS 'efectivo',
    if(ops.modo_pago = 'tarjeta',ops.monto,0) AS 'tarjeta',
    if(ops.modo_pago = 'mutual',ops.monto,0) AS 'mutual',
    if(ops.modo_pago = 'cheque',ops.monto,0) AS 'cheque',
    if(ops.modo_pago = 'ctacte',ops.monto,0) AS 'cuotas',
    if(ops.modo_pago = 'cuota',ops.monto,0) AS 'ctacte'
    from
    (
            SELECT 
            replace(format(chmp.monto,2),',','') as 'monto',
            'ctacte' AS 'modo_pago',
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
            c.tipo='cuota'
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
            chmp.modo_pago <> 'ctacte'
        UNION
            SELECT 
            replace(format(vhmp.monto,2),',','') as  'monto' ,
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
            v.estado='ENTREGADO' AND
            v.cliente_idcliente = cl.idcliente AND 
            vhmp.modo_pago = 'ctacte' AND 
            vhmp.venta_idventa = v.idventa AND 
            DATE(v.fecha_retiro) = DATE(c.fecha)
    ) AS ops;`;
    //v.caja_idcaja=${idcaja}
    connection.query(sql,(err,rows)=>{
        
        callback(rows)
        
    })
    connection.end();
}

module.exports = {
    agregarCaja,
    obtener_caja,
    cerrarCaja,
    informe_caja,
    obtener_lista_cajas_sucursal,
    obtener_caja_id,
    caja_abierta,
}