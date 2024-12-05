const express = require("express");
const router = express.Router();
const controller = require("../../controllers/CambioVentaController")

router.post("/add/cambio/item",(req, res)=>{
    controller.registrar_cambio_venta_item(req,res)
})

module.exports=router