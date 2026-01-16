const VentasDB = require("../database/Venta")
const GastosDB = require("../database/Gasto")
const CobroDB = require("../database/Cobro")
const EnvioDB = require("../database/TransferenciaCaja")
const AdminDB = require("../database/Admin")

const obtener_caja_dia_sucursal = (params, callback) => {
    AdminDB.obtener_caja_dia_sucursal(params,(rows)=>{
        callback(rows)
    })
} 

const obtener_resumen_operaciones_sucursal = (idcaja,callback) => {
    AdminDB.obtener_resumen_totales(idcaja,(rows)=>{
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

const obtener_totales_vendedores_dia = (data,callback) => {
    AdminDB.obtener_totales_vendedores_dia(data,(rows)=>{
        callback(rows)
    })
}

const obtener_ventas_dia_vendedor = (data,callback) => {
    AdminDB.obtener_ventas_dia_vendedor(data,(rows)=>{
        callback(rows)
    })
}
const ventas_dia_totales = (data,callback) => {
    AdminDB.ventas_dia_totales(data,(rows)=>{
        callback(rows)
    })
}

const totales_stock_ventas_periodo = (data, callback) => {
    AdminDB.totales_stock_ventas_periodo(data,(rows)=>{
        callback(rows)
    })
}

const lista_ventas_sucursal_periodo = (data,callback) => {
    AdminDB.lista_ventas_sucursal_periodo(data,(rows)=>{
        callback(rows)
    })
}

const total_tarjetas_periodo = (data, callback) => {
    AdminDB.total_tarjetas_periodo(data,(response)=>{
        callback(response)
    })
}

const total_cobros_tipo_periodo = (data, callback) => {
    AdminDB.total_cobros_tipo_periodo(data,(response)=>{
        callback(response)
    })
}

const total_ventas_periodo_sucursal = (data, callback) => {
    AdminDB.total_ventas_periodo_sucursal(data,(response)=>{
        callback(response)
    })
}

module.exports = {
    total_tarjetas_periodo,
    lista_ventas_sucursal_periodo,
    totales_stock_ventas_periodo,
    ventas_dia_totales,
    obtener_lista_cobros_admin,
    obtener_lista_envios_admin,
    obtener_lista_gastos_admin,
    obtener_lista_ventas_admin,
    obtener_resumen_operaciones_sucursal,
    obtener_caja_dia_sucursal,
    obtener_totales_vendedores_dia,
    obtener_ventas_dia_vendedor,
    total_cobros_tipo_periodo,
    total_ventas_periodo_sucursal,
}