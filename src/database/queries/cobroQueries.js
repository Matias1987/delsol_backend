const { escapeHelper } = require("../helpers/queriesHelper");

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

const queryAgregarCobroV2 = (idcaja, data) => `insert into cobro (            
                caja_idcaja,
                usuario_idusuario,
                cliente_idcliente,
                venta_idventa,
                monto,
                tipo,
                sucursal_idsucursal,
                fecha
                ) values (
                ${escapeHelper(idcaja)}, 
                ${escapeHelper(data.usuario_idusuario)}, 
                ${typeof data.idcliente === 'undefined' ? 'null' : escapeHelper(data.idcliente)}, 
                ${typeof data.idventa === 'undefined' ? 'null' : escapeHelper(data.idventa)}, 
                ${data.monto - data.mp.ctacte_monto /* subtract ctacte monto */}, 
                ${escapeHelper(data.tipo)},
                ${escapeHelper(data.sucursal_idsucursal)},
                date('${data.fecha}')
                )`;

const queryUpdateVentaMontos = (data, total) => `UPDATE venta  v SET v.descuento=${data.descuento}, v.debe=v.subtotal-${data.descuento},  v.monto_total=v.subtotal-${data.descuento},  v.haber=v.haber + ${total}, v.saldo = v.saldo - ${total} WHERE v.idventa=${(data.idventa || "0")};`

const queryInsertMP = `INSERT INTO cobro_has_modo_pago 
                (
                    cobro_idcobro,
                    modo_pago, 
                    banco_idbanco, 
                    mutual_idmutual, 
                    monto, 
                    cant_cuotas, 
                    monto_cuota, 
                    total_int,
                    fk_tarjeta

                ) VALUES `;

const queryInsertVentaMP = `INSERT INTO venta_has_modo_pago 
        (
            venta_idventa, 
            modo_pago, 
            banco_idbanco, 
            mutual_idmutual,
            monto, 
            monto_int, 
            cant_cuotas, 
            monto_cuota,
            fk_tarjeta

        ) VALUES `;
const queryRemoveMPRows = (data) => `DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.venta_idventa=${data.idventa};`;
const queryRemoveCtaCteRows = (data) => `DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.modo_pago = 'ctacte' and vhmp.venta_idventa=${data.idventa};`;

const queryInsertarMPCtaCte = (data) => `INSERT INTO venta_has_modo_pago 
        (
            venta_idventa, 
            modo_pago, 
            banco_idbanco, 
            mutual_idmutual,
            monto, 
            monto_int, 
            cant_cuotas, 
            monto_cuota
            ) VALUES (
                ${data.idventa},
                '${'ctacte'}',
                ${null},
                ${null},
                ${data.mp.ctacte_monto},
                ${parseFloat(data.mp.ctacte_cuotas) * parseFloat(data.mp.ctacte_monto_cuotas)}, 
                ${data.mp.ctacte_cuotas},
                ${data.mp.ctacte_monto_cuotas})`;

module.exports = {
    queryInsertarMPCtaCte,
    queryRemoveMPRows,
    queryRemoveCtaCteRows,
    queryInsertVentaMP,
    queryInsertMP,
    queryUpdateVentaMontos,
    queryListaCobrosSucursal,
    queryAgregarCobro,
    queryDetalleCobro,
    queryListaCobros,
    queryListaCobroModoPago,
    queryAgregarCobroV2,
}