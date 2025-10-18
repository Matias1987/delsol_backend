const express = require("express");
const controller = require("../../controllers/InformeVentasController");
const router = express.Router();

router.post("/inf/vtas/mes/",(req, res)=>{
    controller.informe_venta_montos_mes(req,res)
})

router.post("/inf/vtas/med/",(req, res)=>{
    controller.informe_ventas_medicos(req,res)
})



module.exports = router;