const express = require("express");
const router = express.Router();
const conceptoGastoController = require("../../controllers/ConceptoGastoController");

router.get("/", (req, res) => {
  conceptoGastoController.obtenerConceptosGastos(req,res)
});

router.get("/:clienteId", (req, res) => {
  res.send("Get an existing workout");
});

router.post("/", (req, res) => {
  conceptoGastoController.agregarConceptoGasto(req,res);
});

router.patch("/:clienteId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:clienteId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;