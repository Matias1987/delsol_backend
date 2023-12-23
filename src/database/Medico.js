const mysql_connection = require("../lib/mysql_connection")

const ventas_medico = (data, callback) =>{
    const query = `SELECT 
    v.idventa,
    CONCAT(c.apellido,' ',c.nombre) AS 'cliente',
    c.dni,
    v.tipo,
    v.monto_total
     FROM venta v , cliente c WHERE 
    v.cliente_idcliente = c.idcliente AND 
    YEAR(v.fecha_retiro) = ${data.anio} AND
    MONTH(v.fecha_retiro) = ${data.mes} AND 
    v.estado='ENTREGADO' AND 
    v.medico_idmedico=${data.idmedico}`;
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        return callback(rows)
    })
    connection.end()
}

const ventas_medico_totales = (data, callback) => {
    const _query = `SELECT m.nombre AS 'medico', m_op.* FROM 
	medico m, 
	(SELECT 
		v.medico_idmedico,
		sum(if(vmp.modo_pago='efectivo',vmp.monto,0)) AS 'efectivo',
		sum(if(vmp.modo_pago='tarjeta',vmp.monto,0)) AS 'tarjeta',
		sum(if(vmp.modo_pago='cheque',vmp.monto,0)) AS 'cheque',
		sum(if(vmp.modo_pago='ctacte',vmp.monto,0)) AS 'ctacte',
		sum(if(vmp.modo_pago='mutual',vmp.monto,0)) AS 'mutual'
	FROM 
		venta_has_modo_pago vmp, venta v 
	WHERE
		v.medico_idmedico IS NOT NULL AND 
		vmp.venta_idventa = v.idventa AND 
		YEAR(v.fecha_retiro) = ${data.anio} AND 
		MONTH(v.fecha_retiro) = ${data.mes} AND 
		v.estado = 'ENTREGADO' 
		GROUP BY v.medico_idmedico
	)AS m_op
	WHERE m_op.medico_idmedico = m.idmedico;`
    console.log(_query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(_query,(err,rows)=>{
        return callback(rows)
    })
    connection.end()
}

const buscar_medico = (value, callback) => {
    const _value = decodeURIComponent(value);
    const query = `SELECT * FROM medico m WHERE m.nombre LIKE '%${_value}%';`;
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(query, (err,rows)=>{
        return callback(rows)
    })
    connection.end();
}

const obtener_medicos = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from medico",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_medico = (id,callback) =>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`select * from medico m where m.idmedico = ${id} ;`,(err,rows)=>{
        callback(rows)
    });
    connection.end();
}

const agregar_medico = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into medico (nombre, matricula) values (?)";

    var values = [[
        data.nombre,
        data.matricula,
    ]];

    connection.query(sql,values, (err,result,fields) => {
            return callback(result.insertId)
        });
    connection.end();
}

module.exports = {
    ventas_medico,
    ventas_medico_totales,
    obtener_medicos,
    agregar_medico,
    obtener_medico,
    buscar_medico,
}