const FacturaDB = require("../database/Factura")

const obtener_facturas = (callback) => {
    FacturaDB.obtener_facturas((rows)=>{
        return callback(rows)
    })
}

const agregar_factura = (data,callback) => {
    FacturaDB.agregar_factura(data,(id)=>{
        return callback(id)
    })
}

module.exports = {
    obtener_facturas,
    agregar_factura
}