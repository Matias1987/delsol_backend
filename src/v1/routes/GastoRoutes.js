const express = require("express");
const router = express.Router();
const gastoController = require("../../controllers/GastoController")

router.get("/", (req, res) => {
  gastoController.obtenerGastos(req,res)
});

router.get("/:clienteId", (req, res) => {
  res.send("Get an existing workout");
});

router.post("/", (req, res) => {
  gastoController.agregarGasto(req,res)
});

router.patch("/:clienteId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:clienteId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;