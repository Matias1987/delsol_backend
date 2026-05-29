const mysql_connection = require("../lib/mysql_connection");
const { doQuery, escapeHelper } = require("./helpers/queriesHelper");

const agregar_pago_proveedor = (data,callback) => {

    console.log('data pago proveedor:',JSON.stringify(data));

   
     const query_pago = `INSERT INTO pago_proveedor (fk_proveedor, monto) VALUES (${escapeHelper(data.fk_proveedor)}, ${escapeHelper(data.monto)});`

    doQuery(query_pago, (err, resp) => {
        const insertedId = resp.insertId;
        //go thru mp
        let mp=''
        data.mp.forEach(mp=>{
            mp+= (mp.length>0?',':'') +`(${escapeHelper(mp.modo_pago)},${escapeHelper(insertedId)},${escapeHelper(mp.monto)},${escapeHelper(mp.fkcta_bancaria)})`
        })

        const query_modo = `INSERT INTO pago_proveedor_modo (modo_pago, fk_pago_proveedor, monto, fk_cuenta_bancaria) VALUES ${mp};`
        //console.log(query_modo);
        doQuery(query_modo,(_resp)=>{
            callback(_resp.data)
        })
    })

}

const lista_pago_proveedor = (data, callback) => {

}

const anular_pago_proveedor = (data,callback) => {

}

const detalle_pago_proveedor = (data, callback) => {

}

const obtener_pagos_no_saldados = ({idproveedor, moneda, modo}, callback) =>{
    const query = `SELECT * FROM pago_proveedor pp WHERE 
    pp.saldado=0 AND 
    pp.moneda='${moneda}' AND 
    pp.modo_ficha='${modo}' AND 
    pp.fk_proveedor=${idproveedor};`;
    
    doQuery(query, response=>{
        callback(response.data)
    })
}

module.exports = {
    agregar_pago_proveedor,
    anular_pago_proveedor,
    lista_pago_proveedor,
    detalle_pago_proveedor,
}