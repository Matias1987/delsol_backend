const adminService = require("../services/AdminService")

const obtener_lista_ventas_admin = (callback) =>{
    adminService.obtener_lista_ventas_admin((rows)=>{
        return callback(rows)
    })
}

const obtener_lista_gastos_admin = (callback) => {
    adminService.obtener_lista_gastos_admin((rows)=>{
        return callback(rows)
    })
}

const obtener_lista_cobros_admin = (callback) =>{
    adminService.obtener_lista_cobros_admin((rows)=>{
        return callback(rows)
    })
}

const obtener_lista_envios_admin = (callback) => {
    adminService.obtener_lista_envios_admin((rows)=>{
        return callback(rows)
    })
}

module.exports = {
    obtener_lista_cobros_admin,
    obtener_lista_envios_admin,
    obtener_lista_gastos_admin,
    obtener_lista_ventas_admin,
}