const { idf_optica } = require("../lib/global");
const mysql_connection = require("../lib/mysql_connection");
const { obtenerCajaAbierta } = require("./queries/cajaQueries");
const { insertEvento } = require("./queries/eventoQueries");
const UsuarioDB = require("./Usuario")
const caja_exists = (data,callback) => {
    const query = `SELECT c.idcaja FROM caja c WHERE DATE(c.fecha) = DATE('${data.fecha}') AND c.sucursal_idsucursal=${data.idsucursal};`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const caja_abierta = (idsucursal,callback) =>{
    const query = `SELECT c.idcaja AND if(date(c.fecha) = DATE(NOW()),1,0) AS 'actual' FROM caja c WHERE c.estado='ABIERTA' AND c.sucursal_idsucursal=${idsucursal};`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        if(rows!=null){
            if(rows.length>0)
            {
                callback({abierta:1,current:rows[0].actual == 1 ? 1:0})
            }
            else{
                callback({abierta:0,current:0})
            }
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
    const query = `UPDATE caja c SET c.estado='CERRADO' WHERE c.idcaja=${idcaja}`
    
    //console.log(query)
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.query(insertEvento("CIERRE CAJA",0,0,idcaja,"CAJA"))
    connection.end();
}

const do_agregarCaja = (data, callback) =>{
    const connection = mysql_connection.getConnection();

    connection.connect();
    //console.log(connection.escape(data.fecha))
    const sql = `insert into caja (sucursal_idsucursal,monto_inicial,estado, fecha) values (${connection.escape(data.sucursal_idsucursal)},${connection.escape(data.monto_inicial)},'${"ABIERTA"}', date(${connection.escape(data.fecha)}))`
    //console.log(sql)
    connection.query(sql,(err,result,fields)=>{
        const _id = result.insertId

        connection.query(insertEvento("ABRIR CAJA",data.usuario_idusuario,data.sucursal_idsucursal,_id,"CAJA"))

        connection.end();

        return callback(_id);
    })
}

const agregarCaja = (data,callback) =>
{
    UsuarioDB.validar_usuario_be(
        {
            tk: data.tk,
            permisos: "venta"
        },
        ()=>{do_agregarCaja(data,callback)},
        ()=>{}
    )
    
}

const obtener_caja = (idsucursal, callback) =>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = `SELECT c.*, date_format(c.fecha, '%d-%m-%Y') as 'fecha_f' FROM caja c WHERE c.sucursal_idsucursal=${idsucursal} AND c.estado='ABIERTA';`;
    connection.query(sql,(err,rows)=>{
        
        if(rows==null)
        {
            callback({message:'error, no se encontro', status: 'error'})
        }
        else{
            if(rows.length>0)
            {
                callback({...rows[0],status:'OK'})
            }
            else{
                callback({message:'error, no se encontro', status: 'error'})
            }
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

const obtener_cajas_fecha = ( fecha, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = `SELECT c.*, date_format(c.fecha, '%d-%m-%Y') as 'fecha_f', s.nombre as 'sucursal' FROM caja c, sucursal s where s.idsucursal = c.sucursal_idsucursal AND DATE(c.fecha)=DATE(${connection.escape(fecha)});`;
    console.log(sql);
    connection.query(sql,(err,rows)=>{
        if(rows==null)
        {
            callback({message:'error, no se encontro', status: 'error'})
        }
        else{
            if(rows.length>0)
            {
                callback(rows)
            }
            else{
                callback({message:'error, no se encontro', status: 'error'})
                console.log("no hay rows");
            }
        }
    })
    connection.end();
}

const informe_caja = (idcaja, callback) =>{
    const connection = mysql_connection.getConnection();
    connection.connect();

    const query_coexp_version = `SELECT 
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
    if(ops.modo_pago = 'cuota',ops.monto,0) AS 'ctacte',
    if(ops.modo_pago = 'mercadopago',ops.monto,0) AS 'mercadopago',
    if(ops.modo_pago = 'transferencia',ops.monto,0) AS 'transferencia'
    from
    (
			/*CUOTAS efvo*/
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
			chmp.modo_pago = 'efectivo' AND 
            c.tipo='cuota' AND
            c.anulado = 0
        UNION /* cierre op */
            SELECT 
            replace(format(chmp.monto,2),',','') as 'monto',
            chmp.modo_pago,
            c.venta_idventa AS 'operacion',
            CONCAT(cl.apellido,' ', cl.nombre) AS 'cliente',
            chmp.cobro_idcobro AS 'recibo',
            'CIERRE OP.' as 'detalle'
            FROM 
            cobro_has_modo_pago chmp,
            (SELECT c0.* FROM cobro c0 INNER JOIN venta v0 ON v0.idventa = c0.venta_idventa AND v0.caja_idcaja=${idcaja} WHERE c0.anulado=0) c,
            cliente cl
            WHERE 
            c.cliente_idcliente = cl.idcliente AND 
            chmp.cobro_idcobro = c.idcobro AND
            c.tipo <> 'cuota' AND 
            chmp.modo_pago <> 'ctacte' AND
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
		UNION /*CUOTA NO EFECTIVO (MERCADOPAGO, CHEQUE, ETC)*/
			SELECT 
            replace(format(chmp.monto,2),',','') as 'monto',
            chmp.modo_pago,
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
			chmp.modo_pago <> 'efectivo' AND 
            c.tipo='cuota' AND
            c.anulado = 0
    ) AS ops;`

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
    if(ops.modo_pago = 'cuota',ops.monto,0) AS 'ctacte',
    if(ops.modo_pago = 'mercadopago',ops.monto,0) AS 'mercadopago',
    if(ops.modo_pago = 'transferencia',ops.monto,0) AS 'transferencia'
    from
    (
			/*CUOTAS efvo*/
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
			chmp.modo_pago = 'efectivo' AND 
            c.tipo='cuota' AND
            c.anulado = 0
        UNION /* cierre op */
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
            chmp.modo_pago <> 'ctacte' AND
            c.anulado = 0
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
		UNION /*CUOTA NO EFECTIVO (MERCADOPAGO, CHEQUE, ETC)*/
			SELECT 
            replace(format(chmp.monto,2),',','') as 'monto',
            chmp.modo_pago,
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
			chmp.modo_pago <> 'efectivo' AND 
            c.tipo='cuota' AND
            c.anulado = 0
    ) AS ops;`;
    //v.caja_idcaja=${idcaja}
    connection.query( idf_optica == 3 ? query_coexp_version : sql,(err,rows)=>{
        
        callback(rows)
        
    })
    connection.end();
}

const resumen_caja = (data, callback) => {

    const connection = mysql_connection.getConnection()

    connection.connect()

    connection.query(obtenerCajaAbierta(data.idsucursal),(err,_rows)=>{
        if(err)
        {
            connection.end()
            return
        }

        const idcaja = _rows[0]?.idcaja

        const query_coexp_version = `SELECT SUM(cmp.monto) AS 'monto', 'ingreso' AS 'tipo', 'Ventas + Cuotas' as 'detalle' FROM 
                                        cobro_has_modo_pago cmp 
                                        INNER JOIN ( SELECT c.* from cobro c WHERE c.caja_idcaja=${idcaja} and c.anulado=0 ) c1 
                                        ON c1.idcobro=cmp.cobro_idcobro 
                                        WHERE 
                                        cmp.modo_pago='efectivo'
                                        union
                                        SELECT SUM(g.monto) AS 'monto', 'egreso' AS 'tipo', 'Gastos' as 'detalle' FROM gasto g WHERE 
                                        g.anulado=0 and 
                                        g.caja_idcaja = ${idcaja}`;

        const query = `SELECT SUM(cmp.monto) AS 'monto', 'ingreso' AS 'tipo', 'Ventas + Cuotas' as 'detalle' FROM 
                        cobro_has_modo_pago cmp 
                        INNER JOIN ( SELECT c.* from cobro c WHERE c.caja_idcaja=${idcaja} and c.anulado=0 ) c1 
                    ON c1.idcobro=cmp.cobro_idcobro 
                    WHERE 
                    cmp.modo_pago='efectivo'
                    union
                    SELECT SUM(g.monto) AS 'monto', 'egreso' AS 'tipo', 'Gastos' as 'detalle' FROM gasto g WHERE 
                   
                    g.anulado=0 and 
                    g.caja_idcaja = ${idcaja}
                    ;`


        connection.query(idf_optica == 3 ? query_coexp_version : query,(err,response)=>{
            callback(response)
        })
        connection.end()

    })

    

    
}

const obtener_caja_nro = (data,callback) => {
    const query = `SELECT  * FROM caja c WHERE c.nro=${data.nro} AND c.sucursal_idsucursal=${data.nro} AND c.estado='${data.nro}';`;
    const connection = mysql_connection.getConnection();

    connection.connect();

    connection.query(query,(err,response)=>{
        if(err)
        {
            return callback({err:1})
        }

        return callback(response)
    })

    connection.end();
}

const obtener_caja_gasto = (data, callback) => {
    const query = `SELECT 
                        c.idcaja
                    FROM   
                        sucursal s, 
                        caja c 
                    WHERE  
                        c.sucursal_idsucursal=${data.idsucursal} AND 
                        s.idsucursal = c.sucursal_idsucursal AND 
                        c.estado='ABIERTA' AND 
                        (case when s.usar_fondo_fijo=1 then c.nro=2 else c.nro=1 end ) ;`;
    
    const connection = mysql_connection.getConnection();
    
    connection.connect();
    
    connection.query(query,(err,response)=>{
        //console.log(JSON.stringify(response))

        if(err)
        {
            return callback({err:1});
        }
        if(response.length<1)
        {
            return callback({err:1});
        }
        return callback(response[0].idcaja);
    });

    connection.end();

}

const cambiar_estado_caja = ({idcaja, estado}, callback) => {
    const query = `UPDATE caja SET estado='${estado}' WHERE idcaja=${idcaja};`;
    console.log(query);
    const connection = mysql_connection.getConnection();

    connection.connect();

    connection.query(query,(err,response)=>{
        if(err)
        {
            return callback({err:1});
        }

        return callback(response);
    });

    connection.end();
}

module.exports = {
    obtener_caja_nro,
    agregarCaja,
    obtener_caja,
    cerrarCaja,
    informe_caja,
    obtener_lista_cajas_sucursal,
    obtener_caja_id,
    caja_abierta,
    caja_exists,
    resumen_caja,
    obtener_caja_gasto,
    obtener_cajas_fecha,
    cambiar_estado_caja,
}