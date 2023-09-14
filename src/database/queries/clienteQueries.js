const queryObtenerClientebyDNI =(dni)=>{
    return `SELECT c.*, 
    CONCAT(c.apellido,', ', c.nombre) AS 'nombre_completo' 
    FROM cliente c WHERE c.dni='${dni}';`;
} 

const queryObtenerClientebyID =(id)=>{
    return `SELECT c.*, 
    CONCAT(c.apellido,', ', c.nombre) AS 'nombre_completo',
    date_format(c.fecha_nacimiento,'%d-%m-%Y') as 'fecha_nacimiento_f'
     FROM cliente c WHERE c.idcliente=${id};`;
} 

const queryObtenerListaClientes = () => {
    return `SELECT c.*, 
    CONCAT(c.apellido,', ', c.nombre) AS 'nombre_completo'
     FROM cliente c where c.destinatario=0;`;
}

const queryAgregarCliente = () => {
    return `INSERT INTO cliente (
        localidad_idlocalidad, 
        nombre, 
        apellido, 
        direccion, 
        dni, 
        telefono1, 
        telefono2,
        destinatario) values (?)`;
}

const queryObtenerBalance = (idcliente) => {
    return `SELECT SUM(op.debe) AS 'debe', SUM(op.haber) AS 'haber'  FROM
    (
        SELECT 
        CONCAT('a',c.idcobro) as 'id',
        c.monto AS 'haber',
        0 AS 'debe'
        FROM 
		  cobro c,
		  venta v,
		  venta_has_modo_pago vmp 
		  WHERE 
		  vmp.venta_idventa = v.idventa AND 
		  v.estado = 'ENTREGADO' AND 
        vmp.modo_pago = 'ctacte' AND 
        c.venta_idventa = vmp.venta_idventa  AND
        c.tipo <> 'cuota' AND
        c.cliente_idcliente=${idcliente}
        union	 
         SELECT 
         CONCAT('b',c.idcobro) as 'id',
        c.monto AS 'haber',
        0 AS 'debe'
         FROM cobro c WHERE c.tipo = 'cuota' AND c.cliente_idcliente=${idcliente}
         union
        SELECT 
        CONCAT('c',v.idventa) as 'id',
        0 AS 'haber', 
        ((v.monto_total - vmp.monto) + vmp.cant_cuotas * vmp.monto_cuota) AS 'debe'
        FROM 
		  venta_has_modo_pago vmp, 
		  venta v 
		  WHERE 
		  v.idventa = vmp.venta_idventa AND 
		  vmp.modo_pago='ctacte' AND 
		  v.cliente_idcliente=${idcliente} AND 
		  v.estado='ENTREGADO'
        union
        SELECT 
        CONCAT('d',cm.idcarga_manual) as 'id',
        0 AS 'haber', 
        cm.monto AS 'debe'
        FROM carga_manual cm WHERE cm.cliente_idcliente=${idcliente}
        
    ) AS op
    ;`
}

module.exports = {
    queryObtenerClientebyDNI,
    queryObtenerClientebyID,
    queryObtenerListaClientes,
    queryAgregarCliente,
    queryObtenerBalance,
}

