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

module.exports = {
    obtener_proveedores,
    agregar_proveedor,
}