const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/AdminController")

router.post("/obtener_caja_s_dia",(req,res)=>{
    adminController.obtener_caja_dia_sucursal(req,res)
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