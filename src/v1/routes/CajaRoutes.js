const express = require("express");
const router = express.Router();
const cajaController = require("../../controllers/CajaController")
router.get("/", (req, res) => {
  cajaController.obtenerCajas(req,res)
});

router.get("/:clienteId", (req, res) => {
  cajaController.obtenerCajas(req,res)
});

router.post("/", (req, res) => {
  cajaController.agregarCaja(req,res)
});

router.patch("/:clienteId", (req, res) => {
  cajaController.cerrarCaja(req,res)
});

module.exports = router;