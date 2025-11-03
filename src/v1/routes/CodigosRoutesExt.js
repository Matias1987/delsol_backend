const express = require("express");
const router = express.Router();
const codigoController = require("../../controllers/CodigoController")


router.post("/insertar_codigos/",(req,res)=>{
  codigoController.agregarCodigos(req,res)
})

module.exports = router;