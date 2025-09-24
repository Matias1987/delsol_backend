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
    ProveedorDB.obtener_ficha_proveedor(data,(rows)=>{
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


module.exports = {
    pagos_atrasados_proveedores,
    agregar_cm_proveedor,
    agregar_pago_proveedor,
    detalle_proveedor,
    obtener_proveedores,
    agregar_proveedor,
    obtener_ficha_proveedor,
}