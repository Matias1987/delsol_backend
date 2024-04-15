const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/AdminController")

router.post("/gr/ventas_dia_totales/",(req,res)=>{
   
    adminController.ventas_dia_totales(req,res)

})


router.post("/obtener_caja_s_dia",(req,res)=>{
    adminController.obtener_caja_dia_sucursal(req,res)
})
router.post("/obtener_totales_ventas_vendedor_dia",(req,res)=>{
    adminController.obtener_totales_vendedores_dia(req,res)
})

router.post("/obtener_ventas_dia_vendedor",(req,res)=>{
    adminController.obtener_ventas_dia_vendedor(req,res)
})

router.post("/inf/stock/ventas/periodo",(req,res)=>{
    adminController.totales_stock_ventas_periodo(req,res)
})

router.get("/resumen_op_sucursal/:idcaja",(req,res)=>{
    adminController.obtener_resumen_operaciones_sucursal(req,res)
})

router.get("/obtener_lista_cobros_admin/",(req,res)=>{
    adminController.obtener_lista_cobros_admin(req,res)
})

router.get("/obtener_lista_envios_admin/",(req,res)=>{
    adminController.obtener_lista_envios_admin(req,res)
})
router.get("/obtener_lista_gastos_admin/",(req,res)=>{
    adminController.obtener_lista_gastos_admin(req,res)
})

router.get("/obtener_lista_ventas_admin",(req,res)=>{
    adminController.obtener_lista_ventas_admin(req,res)
})


module.exports = router;