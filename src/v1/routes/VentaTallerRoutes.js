const express = require("express");
const ventaTallerController = require("../../controllers/VentaTallerController");
const router = express.Router();

router.post("/",(req,res)=>{ventaTallerController.obtener_lista_operaciones(req,res)})

router.post("/ped/",(req,res)=>{
    ventaTallerController.agregar_pedido(req,res)
})

router.post("/c/est/dep/ter/",(req,res)=>{
    ventaTallerController.marcar_como_terminado(req,res)
})

router.post("/c/est/dep/cal/",(req,res)=>{
    ventaTallerController.marcar_como_calibrando(req,res)
})


router.post("/items/op/",(req,res)=>{
    ventaTallerController.obtener_items_operacion(req,res)
})

module.exports = router