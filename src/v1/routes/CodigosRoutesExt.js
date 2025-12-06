const express = require("express");
const router = express.Router();
const codigoController = require("../../controllers/CodigoController")


router.post("/insertar_codigos/",(req,res)=>{
  codigoController.agregarCodigos(req,res)
})

router.post("/modificar/precios/indv/cat/",(req,  res)=>{
  codigoController.modificar_precios_indv_categoria(req,res)
})

module.exports = router;