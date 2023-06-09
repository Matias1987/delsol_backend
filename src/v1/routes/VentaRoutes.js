const express = require("express");
const ventaController = require("../../controllers/VentaController");
const router = express.Router();

router.get("/", (req, res) => {
  ventaController.obtenerVentas(req,res)
});

router.get("/:ventaId", (req, res) => {
  ventaController.obtenerVenta(req,res)
});

router.post("/", (req, res) => {
  ventaController.agregarVenta(req,res)
});

router.patch("/:ventaId", (req, res) => {
  ventaController.editarVenta(req,any)
});

router.delete("/:ventaId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;