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

const obtener_totales_vendedores_dia =(req, res) =>{

    const {body} = req

    adminService.obtener_totales_vendedores_dia(body,(rows)=>{
        res.send({status:"OK", data:rows})
    })
}

const obtener_ventas_dia_vendedor = (req, res) => {
    const {body} = req
    adminService.obtener_ventas_dia_vendedor(body,(rows)=>{
        res.send({status:"OK", data:rows})
    })
}
const ventas_dia_totales = (req, res) => {
    const {body} = req
    adminService.ventas_dia_totales(body,(rows)=>{
        res.send({status:"OK", data:rows})
    })
}

const totales_stock_ventas_periodo = (req, res) => {
    const {body} = req
    adminService.totales_stock_ventas_periodo(body,(rows)=>{
        res.send({status:"OK",data:rows})
    })
}

const lista_ventas_sucursal_periodo = (req, res) => {
    const {body} = req
    adminService.lista_ventas_sucursal_periodo(body,(rows)=>{
        res.send({status:"OK",data:rows})
    })
}

const total_tarjetas_periodo = (req, res) => {
    const {body} = req;
    adminService.total_tarjetas_periodo(body, (response)=>{
        res.send({status:"OK", data:response});
    })
}

module.exports = {
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
    total_tarjetas_periodo,
}