const express = require("express");
const LlamadaController = require("../../controllers/LlamadClienteController");
const router = express.Router();

router.get("/:idcliente", (req, res) => {
    LlamadaController.listaLlamadasCliente(req,res)
  });

  router.post("/",(req,res)=>{
    LlamadaController.agregarLlamada(req,res)
  })

  module.exports = router;