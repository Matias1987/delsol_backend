const express = require("express");
const router = express.Router();
const anotacionController = require("../../controllers/AnotacionController")

router.post("/lista/anot/",(req,res)=>{
    anotacionController.obtenerAnotaciones(req,res)
})

router.get("/:idanotacion",(req,res)=>{
    anotacionController.obtenerAnotacion(req,res)
})

router.post("/",(req,res)=>{
    anotacionController.agregarAnotacion(req,res)
})

module.exports = router