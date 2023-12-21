const express = require("express");
const medicoController = require("../../controllers/MedicoController");
const router = express.Router();

router.get("/", (req, res) => {
  medicoController.obtenerMedicos(req,res)
});

router.get("/:idmedico", (req, res) => {
  medicoController.obtenerMedico(req,res)
});

router.get("/buscar/:value", (req, res) => {
  medicoController.buscarMedico(req,res)
});

router.post("/", (req, res) => {
  medicoController.agregarMedico(req,res);
});

router.post("/ventas_medico_totales/", (req, res) => {
  medicoController.ventas_medico_totales(req,res);
});

router.post("/ventas_medico/", (req, res) => {
  medicoController.ventas_medico(req,res);
});

router.patch("/:clienteId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:clienteId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;