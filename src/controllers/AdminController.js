const adminService = require("../services/AdminService")

const obtener_lista_ventas_admin = (req,res) =>{
    adminService.obtener_lista_ventas_admin((rows)=>{
        res.send({status:"OK", data: rows})
    })
}

const obtener_lista_gastos_admin = (req,res) => {
    adminService.obtener_lista_gastos_admin((rows)=>{
        res.send({status:"OK", data: rows})
    })
}

const obtener_lista_cobros_admin = (req,res) =>{
    adminService.obtener_lista_cobros_admin((rows)=>{
        res.send({status:"OK", data: rows})
    })
}

const obtener_lista_envios_admin = (req,res) => {
    adminService.obtener_lista_envios_admin((rows)=>{
        res.send({status:"OK", data: rows})
    })
}

module.exports = {
    obtener_lista_cobros_admin,
    obtener_lista_envios_admin,
    obtener_lista_gastos_admin,
    obtener_lista_ventas_admin,
}