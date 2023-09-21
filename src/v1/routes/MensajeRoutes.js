const express = require("express");
const mensajeController = require("../../controllers/MensajeController");
const router = express.Router();

router.get("/", (req, res) => {
  mensajeController.obtener_mensajes(req,res)
});

router.post("/", (req, res) => {
    mensajeController.agregar_mensaje(req,res);
  });

module.exports = router 