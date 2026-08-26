const controller = require("../../controllers/InformesCajaController")
const express = require("express");
const router = express.Router();

router.post("/ls/total/cc/m/",(req,res)=>{
    controller.listaTotalCobrosCuotaMes(req,res)
})
router.post("/ls/total/g/m/",(req,res)=>{
    controller.listaTotalGastosMes(req,res)
})
router.post("/monto/ing/cat/",(req,res)=>{
    controller.montoIngresoCategoria(req,res)
})
router.post("/monto/eg/cat/",(req,res)=>{
    controller.montoEgresoCategoria(req,res)
})
router.post("/ls/eg/ig/",(req,res)=>{
    controller.operacionesEgresoIngresoSucursal(req,res)
})

module.exports = router