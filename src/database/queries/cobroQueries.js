const queryDetalleCobro = (id) =>{
    return `SELECT 
    c.* , 
    if(c.tipo='cuota',
    CONCAT('Cuota cliente nro. ',c.cliente_idcliente),
    CONCAT('Seña op. ', c.venta_idventa)
    ) AS 'concepto_pago', 
    date_format(c.fecha,'%d-%m-%Y') as 'fecha_formatted',
    cl.dni AS 'cliente_dni',  
    CONCAT(cl.apellido,', ', cl.nombre) AS 'cliente_nombre'
    FROM cobro c, cliente cl 
    WHERE 
    c.cliente_idcliente = cl.idcliente AND  
    c.idcobro = ${id};`;
}

const queryListaCobroModoPago = (idcobro) => {
    return ``;
}

const queryListaCobros = () => {
    return `SELECT 
    c.* , 
    cl.dni AS 'cliente_dni',  
    CONCAT(cl.apellido,', ', cl.nombre) AS 'cliente_nombre'
    FROM cobro c, cliente cl 
    WHERE 
    c.cliente_idcliente = cl.idcliente;`;
}

const queryListaCobrosSucursal = (idSucursal) => {
    return `SELECT 
    c.* , 
    cl.dni AS 'cliente_dni',  
    CONCAT(cl.apellido,', ', cl.nombre) AS 'cliente_nombre'
    FROM cobro c, cliente cl 
    WHERE 
    c.cliente_idcliente = cl.idcliente;`;
}

const queryAgregarCobro = () => {
    return `insert into cobro (            
        caja_idcaja,
        usuario_idusuario,
        cliente_idcliente,
        venta_idventa,
        monto,
        tipo) values (?)`;
}

module.exports = {
    queryListaCobrosSucursal,
    queryAgregarCobro,
    queryDetalleCobro,
    queryListaCobros,
    queryListaCobroModoPago,
}