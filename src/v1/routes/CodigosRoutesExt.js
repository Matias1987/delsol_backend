const express = require("express");
const router = express.Router();
const codigoController = require("../../controllers/CodigoController")


router.post("/insertar_codigos/",(req,res)=>{
  codigoController.agregarCodigos(req,res)
})

router.post("/modificar/precios/indv/cat/",(req,  res)=>{
  codigoController.modificar_precios_indv_categoria(req,res)
})

router.post("/modificar/cant/critica/",(req, res)=>{
  codigoController.modificar_cant_critica(req,res)
})

router.post("/lp/",(req,res)=>{
  codigoController.obtener_lp_codigos(req,res)
})


module.exports = router;