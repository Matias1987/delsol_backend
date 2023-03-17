const express = require("express");
const router = express.Router();
const cargamanualController = require("../../controllers/CargaManualController");

router.get("/", (req, res) => {
  res.send("Obtener todas las cargas manuales");
});

router.get("/:clienteId", (req, res) => {
  res.send("Get an existing workout");
});

router.post("/", (req, res) => {
  cargamanualController.agregarCargaManual(req,res);
});

router.patch("/:clienteId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:clienteId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;