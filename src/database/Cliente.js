const queries = require("./queries/clienteQueries")
const mysql_connection = require("../lib/mysql_connection")

const agregar_destinatario = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(query,(err,resp)=>{
        callback(resp.insertId)
    })
    connection.end();
}

const agregar_cliente = (data, callback) => {
    
    //create connection 
    const connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(
        queries.queryAgregarCliente(),
        [[
            data.localidad_idlocalidad,
            data.nombre,
            data.apellido,
            data.direccion,
            data.dni,
            data.telefono1,
            data.telefono2
        ]],
        (err,results,fields) => {
            return callback(results.insertId)
        }
    )

    connection.end();

}

const obtener_lista_clientes = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(
        queries.queryObtenerListaClientes(),
        (err,results,fields) =>{
            callback(results)
        }
    )

    connection.end();
}

const detalle_cliente_dni = (dni,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    console.log(queries.queryObtenerClientebyDNI(dni))
    connection.query(
        queries.queryObtenerClientebyDNI(dni),
        (err,results,fields) => {
            callback(results);
        }
    )
    connection.end();
}
const detalle_cliente = (id,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    console.log(queries.queryObtenerClientebyID(id))
    connection.query(
        queries.queryObtenerClientebyID(id),
        (err,results,fields) => {
            callback(results);
        }
    )
    connection.end();
}

const buscar_cliente = (value, callback) =>{
    var _value = decodeURIComponent(value);
    const connection = mysql_connection.getConnection();
    connection.connect();
    
    connection.query(
        `SELECT c.* FROM cliente c WHERE 
    c.apellido LIKE '%${_value}%' OR
    c.nombre LIKE '%${_value}%' OR 
    c.dni LIKE '%${_value}%';`,
    (err,rows)=>{
        console.log(JSON.stringify(rows))
        callback(rows)
    });
    connection.end();


}

const operaciones_cliente = (idcliente,callback) => {
    const query = `select * from
    (
		SELECT 
		c.idcobro as 'id',
		c.fecha as 'fecha',
		date_format(c.fecha  , '%d-%m-%y') as 'fecha_f',
		'ENTREGA' as 'tipo',
		'ENTREGA' as 'detalle',
		0 as 'debe',
		c.monto as 'haber'
		FROM cobro c, venta_has_modo_pago vhmp, venta v  WHERE
        vhmp.venta_idventa = v.idventa AND 
        v.estado = 'ENTREGADO' AND 
		c.venta_idventa = vhmp.venta_idventa AND 
		vhmp.modo_pago='ctacte' AND 
        c.tipo<>'cuota' AND
		c.cliente_idcliente=${idcliente}
		UNION
        select 
        c.idcobro as 'id',
        c.fecha as 'fecha',
        date_format(c.fecha  , '%d-%m-%y') as 'fecha_f',
        'PAGO CUOTA' as 'tipo',
        'PAGO CUOTA' as 'detalle',
        0 as 'debe',
        c.monto as 'haber'
         from cobro c where c.cliente_idcliente=${idcliente} AND c.tipo = 'cuota'
        union
        select 
        v.idventa as 'id',
        v.fecha as 'fecha',
        date_format(v.fecha  , '%d-%m-%y') as 'fecha_f',
        'VENTA'  as 'tipo',
        concat('VENTA cuotas:', vhmp.cant_cuotas, ' monto: ', vhmp.monto_cuota)   as 'detalle',
        ((v.monto_total - vhmp.monto) + vhmp.cant_cuotas * vhmp.monto_cuota) as 'debe',
        0 as 'haber'
         from venta v INNER JOIN venta_has_modo_pago vhmp ON vhmp.venta_idventa = v.idventa AND  
			v.cliente_idcliente=${idcliente} AND v.estado = 'ENTREGADO'  AND vhmp.modo_pago='ctacte'
        union
        select 
        cm.idcarga_manual as 'id',
        cm.fecha as 'fecha',
         date_format(cm.fecha , '%d-%m-%y')  as 'fecha_f',
         'CARGA MANUAL' as 'tipo',
         'CARGA MANUAL' as 'detalle',
         cm.monto as 'debe',
         0 as 'haber'
          from carga_manual cm  where cm.cliente_idcliente=${idcliente}
     ) as ops order by ops.fecha asc;`
    const connection = mysql_connection.getConnection();
    connection.connect();
    
    connection.query(query,(err,rows)=>{
        callback(rows)
    })

}


const obtener_saldo_ctacte = (idcliente,callback) => {
    //FALTAN CONDICIONES EN LA CONSULTA, COMO POR  EJ. TENER EN CTA. QUE LA VENTA NO ESTE ANULADA
    const query  = `SELECT SUM(op.debe) AS 'debe', SUM(op.haber) AS 'haber' FROM
    (
        SELECT 
        c.monto AS 'haber',
        0 AS 'debe'
        FROM cobro c,venta_has_modo_pago vmp WHERE 
        vmp.modo_pago = 'ctacte' AND 
        c.venta_idventa = vmp.venta_idventa  AND
        c.tipo <> 'cuota' AND
        c.cliente_idcliente=${idcliente}
        union
        SELECT 
        0 AS 'haber', 
        vmp.monto_cuota * vmp.cant_cuotas AS 'debe'
        FROM venta_has_modo_pago vmp, venta v WHERE v.idventa = vmp.venta_idventa AND vmp.modo_pago='ctacte' AND v.cliente_idcliente=${idcliente}
        union
        SELECT 
        0 AS 'haber', 
        cm.monto AS 'debe'
        FROM carga_manual cm WHERE cm.cliente_idcliente=${idcliente}
        union
        SELECT 
        c.monto AS 'haber',
        0 AS 'debe'
         FROM cobro c WHERE c.tipo = 'cuota' AND c.cliente_idcliente=${idcliente}
    ) AS op
    ;`

    const connection = mysql_connection.getConnection();
    connection.connect();
    
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
}

module.exports = {
    agregar_cliente, 
    obtener_lista_clientes, 
    detalle_cliente_dni,
    detalle_cliente,
    buscar_cliente,
    operaciones_cliente,
    obtener_saldo_ctacte,
    agregar_destinatario,
};