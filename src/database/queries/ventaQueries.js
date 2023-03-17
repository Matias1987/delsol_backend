const queryAgregarVenta = () => {
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
}

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
	queryAgregarVenta,
}