const ProveedorDB = require("../database/Proveedor")

const obtener_proveedores = (callback) => {
    ProveedorDB.obtener_proveedores((rows)=>{
        return callback(rows)
    })
}

const agregar_proveedor = (data,callback) => {
    ProveedorDB.agregar_proveedor(data,(id)=>{
        callback(id)
    })
}

const obtener_ficha_proveedor = (data,callback) => {
    ProveedorDB.obtener_ficha_proveedor({...data},(rows)=>{
        callback(rows)
    })
}

const detalle_proveedor = (data, callback) => {
    ProveedorDB.detalle_proveedor(data,(rows)=>{
        callback(rows)
    })
}

const agregar_cm_proveedor = (data, callback) => {
    ProveedorDB.agregar_cm_proveedor(data,(resp)=>{
        callback(resp)
    })
}

const agregar_pago_proveedor = (data, callback) => {
    ProveedorDB.agregar_pago_proveedor(data,(resp)=>{
        callback(resp)
    })
}

const pagos_atrasados_proveedores = (data, callback) => {
    ProveedorDB.pagos_atrasados_proveedores(data,(resp)=>{
        callback(resp)
    })
}

const monedas_existentes = (data, callback) => {
    ProveedorDB.monedas_existentes(data,(resp)=>{
        callback(resp)
    })
}

const obtener_pagos_no_saldados = (data, callback) => {
    ProveedorDB.obtener_pagos_no_saldados(data,(response)=>{
        callback(response);
    })
}

const agregar_pago_compra = (data, callback) => {
    ProveedorDB.agregar_pago_compra(data, response=>{
        callback(response);
    })
}

const obtener_cm_saldo= (data, callback) => {
    ProveedorDB.obtener_cm_saldo(data,(response)=>{
        callback(response);
    })
}

module.exports = {
    obtener_cm_saldo,
    obtener_pagos_no_saldados,
    pagos_atrasados_proveedores,
    agregar_cm_proveedor,
    agregar_pago_proveedor,
    detalle_proveedor,
    obtener_proveedores,
    agregar_proveedor,
    obtener_ficha_proveedor,
    monedas_existentes,
    agregar_pago_compra,
}