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

module.exports = {
    detalle_proveedor,
    obtener_proveedores,
    agregar_proveedor,
    obtener_ficha_proveedor,
}