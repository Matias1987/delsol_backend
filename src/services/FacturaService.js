const FacturaDB = require("../database/Factura")

const obtener_facturas = (idprov,callback) => {
    FacturaDB.obtener_facturas(idprov, (rows)=>{
        return callback(rows)
    })
}

const agregar_factura = (data,callback) => {
    FacturaDB.agregar_factura(data,(id)=>{
        return callback(id)
    })
}
const detalle_factura = (data,callback) => {
    FacturaDB.detalle_factura(data,(rows)=>{
        return callback(rows)
    })
}
const lista_elementos_factura = (data,callback) => {
    FacturaDB.lista_elementos_factura(data,(rows)=>{
        return callback(rows)
    })
}



module.exports = {
    lista_elementos_factura,
    detalle_factura,
    obtener_facturas,
    agregar_factura
}