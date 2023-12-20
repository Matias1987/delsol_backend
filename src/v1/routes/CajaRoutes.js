const express = require("express");
const router = express.Router();
const cajaController = require("../../controllers/CajaController")
router.get("/", (req, res) => {
  cajaController.obtenerCajas(req,res)
});

router.get("/caja_abierta/:idsucursal", (req, res) => {
  cajaController.caja_abierta(req,res)
});

router.get("/c/:idsucursal", (req, res) => {
  cajaController.obtener_caja(req,res)
});
router.get("/lista/:idsucursal", (req, res) => {
  cajaController.obtenerCajasSucursal(req,res)
});

router.get("/cerrar/:idcaja", (req, res) => {
  cajaController.cerrarCaja(req,res)
});

router.get("/inf/:idcaja", (req, res) => {
  cajaController.informe_caja(req,res)
});

router.get("/:idcaja", (req, res) => {
  cajaController.obtener_caja_id(req,res)
});

router.post("/exists/", (req, res) => {
  cajaController.caja_exists(req,res)
});

router.post("/", (req, res) => {
  cajaController.agregarCaja(req,res)
});

router.patch("/:clienteId", (req, res) => {
  cajaController.cerrarCaja(req,res)
});

module.exports = router;