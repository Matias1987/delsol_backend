const express = require("express");

const envioController = require("../../controllers/EnvioController");

const router = express.Router();

router.get("/", (req, res) => {
  envioController.obtenerEnvios(req,res);
});

router.get("/:idenvio", (req, res) => {
  envioController.obtenerEnvio(req,res);
});

router.get("/envio_pendientes/:idsucursal", (req, res) => {
  envioController.obtener_envios_pendientes_sucursal(req,res);
});
router.get("/envio_codigo/:idcodigo", (req, res) => {
  envioController.obtener_envios_codigo(req,res);
});

router.post("/", (req, res) => {
  envioController.agregarEnvio(req,res)
});

router.post("/cargarEnvio/", (req, res) => {
  envioController.cargarEnvio(req,res)
});

router.patch("/:envioId", (req, res) => {
  res.send("actualizar una familia");
});

router.delete("/:envioId", (req, res) => {
  res.send("eliminar un envio (logica)");
});

module.exports = router;