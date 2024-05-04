const express = require("express");
const ventaTallerController = require("../../controllers/VentaTallerController");
const router = express.Router();

router.get("/",(req,res)=>{ventaTallerController.obtener_lista(req,res)})

router.post("/ped/",(req,res)=>{
    ventaTallerController.agregar_pedido(req,res)
})

router.post("/c/est/dep/",(req,res)=>{

})

module.exports = router