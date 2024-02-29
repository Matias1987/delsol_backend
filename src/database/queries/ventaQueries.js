const { parse_date_for_mysql } = require("../../lib/helpers");

const parse_venta_data = (body)=> ( {
	cliente_idcliente: body?.fkcliente,
	sucursal_idsucursal: body?.fksucursal,
	medico_idmedico: body?.fkmedico||null,
	caja_idcaja: body?.fkcaja||null,
	usuario_idusuario: body?.fkusuario,
	monto_total: body?.total,
	descuento: body?.descuento,
	fecha_retiro: parse_date_for_mysql( body.fechaRetiro  ),//<--missing in db
	comentarios: body?.comentarios||"",//<--missing in db
	subtotal: body?.subtotal,
	fk_destinatario: body?.fkdestinatario||null,
	fk_os: body?.fkos,
	tipo: body?.tipo, 
	horaRetiro: body?.horaRetiro

})

const venta_insert_query = (data) => ` 
INSERT INTO venta 
(
	cliente_idcliente, 
	sucursal_idsucursal, 
	caja_idcaja, 
	usuario_idusuario, 
	medico_idmedico, 
	monto_total, 
	descuento, 
	subtotal, 
	comentarios, 
	fecha_retiro,
	fk_destinatario,
	fk_os,
	tipo,
	debe,
	saldo,
	hora_retiro
) 
VALUES (
	'${data.cliente_idcliente}', 
	'${data.sucursal_idsucursal}', 
	${data.caja_idcaja}, 
	${data.usuario_idusuario}, 
	${data.medico_idmedico}, 
	'${data.monto_total}', 
	'${data.descuento}', 
	'${data.subtotal}', 
	'${data.comentarios}', 
	'${data.fecha_retiro}',
	${data.fk_destinatario},
	${data.fk_os},
	${data.tipo},
	${data.monto_total},
	${data.monto_total},
	'${data.horaRetiro}'
);
`;
const query_mp = `INSERT INTO venta_has_modo_pago 
					(
					venta_idventa, 
					modo_pago_idmodo_pago, 
					banco_idbanco, 
					mutual_idmutual,
					monto, 
					monto_int, 
					cant_cuotas, 
					monto_cuota,
					fk_tarjeta,
					modo_pago,
					tarjeta_nro
					) VALUES `;
					
const query_items = `INSERT INTO venta_has_stock 
					(
						venta_idventa, 
						stock_sucursal_idsucursal, 
						stock_codigo_idcodigo, 
						cantidad, 
						tipo,
						precio,
						total,
						esf, 
						cil, 
						eje,
						orden,
						descontable,
						curva_base,
						diametro
					) 
					VALUES `;

/*const get_mp = (data, idventa) => {
	var _items_mp = [];
	if(data?.mp?.efectivo_monto!==0){
		_items_mp.push([idventa,'1',null,null,data.mp.efectivo_monto,0,0,0])
	}
	if(data?.mp?.tarjeta_monto!==0){
		_items_mp.push([idventa,'1',null,null,data.mp.tarjeta_monto,0,0,0])
	}
	if(data?.mp?.ctacte_monto!==0){
		_items_mp.push([idventa,'1',null,null,data.mp.ctacte_monto,0,0,0])
	}
	if(data?.mp?.cheque_monto!==0){
		_items_mp.push([idventa,'1',null,null,data.mp.cheque_monto,0,0,0])
	}
	if(data?.mp?.mutual_monto!==0){
		_items_mp.push([idventa,'1',null,null,data.mp.mutual_monto,0,0,0])
	}
	return _items_mp;
	
}*/

const get_mp = (data, idventa) => {
	var _items_mp = [];
	if(data.mp!=null){
		if(data?.mp?.efectivo_monto!==0){
			_items_mp.push({
				venta_idventa:idventa,
				modo_pago_idmodo_pago:'1',
				banco_idbanco:null,
				mutual_idmutual:null,
				monto:data.mp.efectivo_monto,
				monto_int:0,
				cant_cuotas:0,
				monto_cuota:0,
				fk_tarjeta: null,
				modo_pago: 'efectivo',
				tarjeta_nro: null,
			})
		}
		if(data?.mp?.tarjeta_monto!==0){
			_items_mp.push({
				venta_idventa:idventa,
				modo_pago_idmodo_pago:'2',
				banco_idbanco:null,
				mutual_idmutual:null,
				monto:data.mp.tarjeta_monto,
				monto_int:0,
				cant_cuotas:(typeof data.mp.tarjeta_tarjeta === 'undefined' ? 0 : data.mp.tarjeta_tarjeta),
				monto_cuota:0,
				fk_tarjeta: data.mp.fk_tarjeta,
				modo_pago: 'tarjeta',
				tarjeta_nro: (typeof data.mp.tarjeta_nro === 'undefined' ? 0 : data.mp.tarjeta_nro)
			})
		}
		if(data?.mp?.ctacte_monto!==0){
			_items_mp.push({
				venta_idventa:idventa,
				modo_pago_idmodo_pago:'3',
				banco_idbanco:null,
				mutual_idmutual:null,
				monto:data.mp.ctacte_monto,
				monto_int:parseFloat(data.mp.ctacte_cuotas) * parseFloat(data.mp.ctacte_monto_cuotas),
				cant_cuotas:data.mp.ctacte_cuotas,
				monto_cuota:data.mp.ctacte_monto_cuotas,
				fk_tarjeta: null,
				modo_pago: 'ctacte',
				tarjeta_nro: null,
			})
		}
		if(data?.mp?.cheque_monto!==0){
			_items_mp.push({
				venta_idventa:idventa,
				modo_pago_idmodo_pago:'4',
				banco_idbanco:data.mp.fk_banco,
				mutual_idmutual:null,
				monto:data.mp.cheque_monto,
				monto_int:0,
				cant_cuotas:0,
				monto_cuota:0,
				fk_tarjeta: null,
				modo_pago: 'cheque',
				tarjeta_nro: null,
			})
		}
		if(data?.mp?.mutual_monto!==0){
			_items_mp.push({
				venta_idventa:idventa,
				modo_pago_idmodo_pago:'5',
				banco_idbanco:null,
				mutual_idmutual:null,
				monto:data.mp.mutual_monto,
				monto_int:0,
				cant_cuotas:0,
				monto_cuota:0,
				fk_tarjeta: null,
				modo_pago: 'mutual',
				tarjeta_nro: null,
			})
		}
		if(data?.mp?.mercadopago_monto!==0){
			_items_mp.push({
				venta_idventa:idventa,
				modo_pago_idmodo_pago:'6',
				banco_idbanco:null,
				mutual_idmutual:null,
				monto:data.mp.mercadopago_monto,
				monto_int:0,
				cant_cuotas:0,
				monto_cuota:0,
				fk_tarjeta: null,
				modo_pago: 'mercadopago',
				tarjeta_nro: null,
			})
		}
	}
	
	return _items_mp;
	
}

const queryDetalleVenta = (id) =>{
    return `SELECT v.*,
	c.dni AS 'cliente_dni',
	CONCAT(c.apellido,', ', c.nombre) AS 'cliente_nombre',
	if(m.idmedico is NULL , '', m.nombre) AS 'medico',
	s.nombre AS 'sucursal_nombre',
	u.nombre AS 'usuario_nombre',
	date_format(v.fecha, '%d-%m-%Y') as 'fecha_formated',
	date_format(v.fecha_retiro, '%d-%m-%Y') as 'fecha_entrega_formated',
	date_format(v.fecha, '%H:%i') as 'hora',
	if(mut.idmutual IS NULL, '', mut.nombre) AS 'obra_social'
FROM
	
	cliente c,
	sucursal s,
	usuario u,
	venta v 
	LEFT JOIN 
	medico m ON m.idmedico = v.medico_idmedico
	LEFT JOIN 
	mutual mut ON mut.idmutual = v.fk_os
	WHERE
	c.idcliente = v.cliente_idcliente and
	s.idsucursal = v.sucursal_idsucursal and
	u.idusuario = v.usuario_idusuario and 
	v.idventa = ${id};`;
}

const queryListaVentasTotal = () => {
    return `SELECT v.*,
	cl.dni AS 'cliente_dni',  
	CONCAT(cl.apellido,', ', cl.nombre) AS 'cliente_nombre',
	m.nombre AS 'medico_nombre',
	s.nombre AS 'sucursal_nombre',
	u.nombre AS 'usuario_nombre'
 FROM 
	venta v , 
	cliente c,
	medico m,
	sucursal s,
	usuario u
	WHERE 
	c.idcliente = v.cliente_idcliente and 
	m.idmedico = v.medico_idmedico and
	s.idsucursal = v.sucursal_idsucursal and
	u.idusuario = v.vendedor_idvendedor;`;
}

const queryListaVentasSucursal  = (idSucursal) =>
{
    return `SELECT v.*,
	cl.dni AS 'cliente_dni',  
	CONCAT(cl.apellido,', ', cl.nombre) AS 'cliente_nombre',
	m.nombre AS 'medico_nombre',
	s.nombre AS 'sucursal_nombre',
	u.nombre AS 'usuario_nombre'
 FROM 
	venta v , 
	cliente c,
	medico m,
	sucursal s,
	usuario u
	WHERE 
	c.idcliente = v.cliente_idcliente and 
	m.idmedico = v.medico_idmedico and
	s.idsucursal = v.sucursal_idsucursal and
	u.idusuario = v.vendedor_idvendedor and
    s.idsucursal = ${idSucursal};`;
}

const queryListaVentasSucursalEstado = (
	idsucursal="", 
	estado="", 
	tipo="",
	medico_idmedico="",
	fk_destinatario="",
	cliente_idcliente="", 
	id="",
	en_laboratorio="",
	fecha="",
	idusuario="",
	) => (
	`SELECT 
	v.idventa, 
	CONCAT(c.apellido,', ',c.nombre) AS 'cliente',
	u.nombre AS 'vendedor',
	v.estado,
	v.tipo,
	v.monto_total as 'monto',
	date_format(v.fecha, '%d-%m-%y') AS 'fecha',
	DATE_FORMAT(v.fecha_retiro, '%d-m%-%y') AS 'fecha_retiro',
	v.sucursal_idsucursal,
	v.cliente_idcliente,
	v.en_laboratorio,
	s.nombre as 'sucursal'
	FROM 
	venta v, 
	cliente c, 
	usuario u, 
	sucursal s
	WHERE
	s.idsucursal = v.sucursal_idsucursal AND 
	v.cliente_idcliente = c.idcliente AND
	v.usuario_idusuario = u.idusuario AND
	(case when '${idsucursal}'<>'' then v.sucursal_idsucursal = '${idsucursal}' else true end) AND 
	(case when '${estado}'<>'' then v.estado = '${estado}' ELSE TRUE END) AND
	(case when '${tipo}'<>'' then v.tipo = '${tipo}' ELSE TRUE END) AND
	(case when '${cliente_idcliente}'<>'' then v.cliente_idcliente = '${cliente_idcliente}' ELSE TRUE END) AND
	(case when '${fk_destinatario}'<>'' then v.fk_destinatario = '${fk_destinatario}' ELSE TRUE END) AND
	(case when '${medico_idmedico}'<>'' then v.medico_idmedico = '${medico_idmedico}' ELSE TRUE END) AND
	(case when '${id}'<>'' then v.idventa = '${id}' ELSE TRUE END) AND
	(case when '${en_laboratorio}'<>'' then v.en_laboratorio='${en_laboratorio}'  ELSE TRUE END) AND
	(case when '${fecha}' <> '' then date(v.fecha) =  date('${fecha=='' ? '1970-1-1' : fecha}') else true end) AND
	(case when '${idusuario}'<> '' then v.usuario_idusuario = '${idusuario}' else true end)
	ORDER by v.idventa desc
	LIMIT 200
	`
)

const queryListaVentaStock = (ventaId) =>{
    return `SELECT 
	vhs.tipo, 
	vhs.esf, 
	vhs.cil, 
	vhs.eje, 
	vhs.precio, 
	vhs.cantidad,
	vhs.total,
	c.codigo, 
	vhs.curva_base,
	vhs.diametro,
	c.descripcion,
	vhs.stock_codigo_idcodigo,
	vhs.idventaitem
	FROM venta_has_stock vhs, codigo c WHERE 
	c.idcodigo = vhs.stock_codigo_idcodigo AND 
	vhs.venta_idventa=${ventaId} order by vhs.orden;
    ;`;
}

const queryListaVentaModoPago = (ventaId) => {
    return `SELECT 
    vhmp.monto, 
    vhmp.monto_int,
    vhmp.cant_cuotas, 
    vhmp.monto_cuota,
    mp.nombre
    FROM venta_has_modo_pago vhmp, modo_pago mp WHERE  
    mp.idmodo_pago = vhmp.modo_pago_idmodo_pago and
    vhmp.venta_idventa=${ventaId};`;
}

module.exports = {
    queryDetalleVenta,
    queryListaVentaStock,
    queryListaVentaModoPago,
    queryListaVentasTotal,
    queryListaVentasSucursal,
	//queryAgregarVenta,
	venta_insert_query,
	get_mp,
	parse_venta_data,
	queryListaVentasSucursalEstado,
	query_items,
	query_mp,

}