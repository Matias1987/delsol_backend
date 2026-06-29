const { escapeHelper } = require("../helpers/queriesHelper")

const pagoProveedorQueries = {
    insertPagoQuery = (data) => `INSERT INTO pago_proveedor (fk_proveedor, monto) VALUES (${escapeHelper(data.fk_proveedor)}, ${escapeHelper(data.monto)});`,
    insertModoPagoQuery = (data, pagoID) =>{
         let mp=''
        data.mp.forEach(mp=>{
            mp+= (mp.length>0?',':'') +`(${escapeHelper(mp.modo_pago)},${escapeHelper(pagoID)},${escapeHelper(mp.monto)},${escapeHelper(mp.fkcta_bancaria)})`
        });

        return `INSERT INTO pago_proveedor_modo (modo_pago, fk_pago_proveedor, monto, fk_cuenta_bancaria) VALUES ${mp};`
    },
}

module.exports = {pagoProveedorQueries}