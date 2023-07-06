const parse_venta_data = (body)=> ( {
	cliente_idcliente: body?.fkcliente,
	sucursal_idsucursal: body?.fksucursal,
	medico_idmedico: body?.fkmedico||null,
	caja_idcaja: body?.fkcaja||null,
	usuario_idusuario: body?.fkusuario,
	monto_total: body?.total,
	descuento: body?.descuento,
	fecha_retiro: body?.fechaRetiro,//<--missing in db
	comentarios: body?.comentarios||"",//<--missing in db
	subtotal: body?.subtotal,
	fk_destinatario: body?.fkdestinatario,
	fk_os: body?.fkos,

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
	fk_os
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
	STR_TO_DATE('${data.fecha_retiro}','%d-%m-%Y'),
	${data.fk_destinatario},
	${data.fk_os}
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
					monto_cuota) VALUES `;
					
const query_items = `INSERT INTO venta_has_stock 
					(
					venta_idventa, 
					stock_sucursal_idsucursal, 
					stock_codigo_idcodigo, 
					cantidad, 
					esf, 
					cil, 
					eje) 
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
	if(data?.mp?.efectivo_monto!==0){
		_items_mp.push({
			venta_idventa:idventa,
			modo_pago_idmodo_pago:'1',
			banco_idbanco:null,
			mutual_idmutual:null,
			monto:data.mp.efectivo_monto,
			monto_int:0,
			cant_cuotas:0,
			monto_cuota:0})
	}
	if(data?.mp?.tarjeta_monto!==0){
		_items_mp.push({
			venta_idventa:idventa,
			modo_pago_idmodo_pago:'2',
			banco_idbanco:null,
			mutual_idmutual:null,
			monto:data.mp.tarjeta_monto,
			monto_int:0,
			cant_cuotas:0,
			monto_cuota:0})
	}
	if(data?.mp?.ctacte_monto!==0){
		_items_mp.push({
			venta_idventa:idventa,
			modo_pago_idmodo_pago:'3',
			banco_idbanco:null,
			mutual_idmutual:null,
			monto:data.mp.ctacte_monto,
			monto_int:0,
			cant_cuotas:0,
			monto_cuota:0})
	}
	if(data?.mp?.cheque_monto!==0){
		_items_mp.push({
			venta_idventa:idventa,
			modo_pago_idmodo_pago:'4',
			banco_idbanco:null,
			mutual_idmutual:null,
			monto:data.mp.cheque_monto,
			monto_int:0,
			cant_cuotas:0,
			monto_cuota:0})
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
			monto_cuota:0})
	}
	
	
	return _items_mp;
	
}

/*const queryAgregarVenta = () => {
	return ` insert into venta 
	(   cliente_idcliente,
		sucursal_idsucursal,
		vendedor_idvendedor,
		caja_idcaja,
		usuario_idusuario,
		medico_idmedico,
		monto_total,
		descuento,
		monto_inicial,
		debe,
		haber,
		saldo,
		fecha,
		fecha_alta
		) values (?)`;
}*/

const queryDetalleVenta = (id) =>{
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

const queryListaVentaStock = (ventaId) =>{
    return `SELECT vhs.cantidad , c.codigo, c.descripcion
    FROM 
    venta_has_stock vhs, 
    codigo c 
    WHERE
    vhs.stock_codigo_idcodigo = c.idcodigo and
    vhs.venta_idventa = ${ventaId}
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
	query_mp,
	query_items,
	get_mp,
	parse_venta_data,
}