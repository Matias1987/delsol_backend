const express = require("express");
const router = express.Router();
const controlStockController = require("../../controllers/ControlStockController");

router.get("/",(req,res)=>{
    controlStockController.obtener_lista_controles(req,res)
})

module.exports=router;
