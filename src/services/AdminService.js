const VentasDB = require("../database/Venta")
const GastosDB = require("../database/Gasto")
const CobroDB = require("../database/Cobro")
const EnvioDB = require("../database/TransferenciaCaja")
const AdminDB = require("../database/Admin")

const obtener_resumen_operaciones_sucursal = (idsucursal,callback) => {
    AdminDB.obtener_operaciones(idsucursal,(rows)=>{
        callback(rows)
    })
}

const obtener_lista_ventas_admin = (callback) =>{
    VentasDB.lista_ventas_admin((rows)=>{
        return callback(rows)
    })
}

const obtener_lista_gastos_admin = (callback) => {
    GastosDB.lista_gastos_admin((rows)=>{
        return callback(rows)
    })
}

const obtener_lista_cobros_admin = (callback) =>{
    
}

const obtener_lista_envios_admin = (callback) => {

}

module.exports = {
    obtener_lista_cobros_admin,
    obtener_lista_envios_admin,
    obtener_lista_gastos_admin,
    obtener_lista_ventas_admin,
    obtener_resumen_operaciones_sucursal,
}