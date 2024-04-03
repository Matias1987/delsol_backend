const express = require("express");
const router = express.Router();
const controlStockController = require("../../controllers/ControlStockController");

router.get("/:idsucursal",(req,res)=>{
    controlStockController.obtener_lista_controles(req,res)
})

router.post("/",(req, res)=>{
    controlStockController.agregar_control(req,res)
})

module.exports=router;
