const express = require("express");
const controller = require("../../controllers/ObjetivoSucursalController");
const router = express.Router();


router.post("/",(req,res)=>{
    controller.establecer_objetivo_sucursal(req,res)
})

router.post("/list",(req,res)=>{
    controller.obtener_objetivo_sucursal(req,res)
})

router.post("/get/progress",(req,res)=>{
    controller.obtener_progreso_sucursal_objetivo(req,res)
})


module.exports = router