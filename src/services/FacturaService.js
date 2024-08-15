const FacturaDB = require("../database/Factura")

const obtener_facturas = (idprov,callback) => {
    FacturaDB.obtener_facturas(idprov, (rows)=>{
        return callback(rows)
    })
}

const agregar_factura = (data,callback) => {
    //FacturaDB.agregar_factura_v2(data,(id)=>{
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

const obtener_factura_por_nro = (data, callback) => {
    FacturaDB.obtener_factura_por_nro(data,(resp)=>{
        return callback(resp)
    })
}



module.exports = {
    obtener_factura_por_nro,
    lista_elementos_factura,
    detalle_factura,
    obtener_facturas,
    agregar_factura
}