const express = require("express");

const envioController = require("../../controllers/EnvioController");

const router = express.Router();

router.get("/", (req, res) => {
  envioController.obtenerEnvios(req,res);
});

router.get("/:envioId", (req, res) => {
  res.send("obtener una familia con id");
});

router.post("/", (req, res) => {
  envioController.agregarEnvio(req,res);
});

router.patch("/:envioId", (req, res) => {
  res.send("actualizar una familia");
});

router.delete("/:envioId", (req, res) => {
  res.send("eliminar un envio (logica)");
});

module.exports = router;