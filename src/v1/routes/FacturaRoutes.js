const express = require("express");

const facturaController = require("../../controllers/FacturaController");

const router = express.Router();

router.get("/", (req, res) => {
    facturaController.obtener_facturas(req,res)
});

router.get("/:proveedorId", (req, res) => {
  res.send("obtener una familia con id");
});

router.post("/", (req, res) => {
    facturaController.agregar_factura(req,res)
});

router.patch("/:facturaId", (req, res) => {
  res.send("actualizar una factura");
});

router.delete("/:facturaId", (req, res) => {
  res.send("eliminar factura (logica)");
});

module.exports = router;