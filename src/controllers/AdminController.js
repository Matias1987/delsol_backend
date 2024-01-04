const adminService = require("../services/AdminService")

const obtener_caja_dia_sucursal = (req, res) => {
    const {body} = req
    adminService.obtener_caja_dia_sucursal(body, (rows)=>{
        res.send({status:"OK", data: rows})
    })

}

const obtener_resumen_operaciones_sucursal = (req, res) => {
    const {params:{idcaja}} = req;
    adminService.obtener_resumen_operaciones_sucursal(idcaja,(rows)=>{
        res.send({status:"OK", data: rows})
    })
}

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
    obtener_resumen_operaciones_sucursal,
    obtener_caja_dia_sucursal,
}