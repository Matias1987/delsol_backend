const express = require("express");
const medicoController = require("../../controllers/MedicoController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Obtener todo los clientes");
});

router.get("/:clienteId", (req, res) => {
  res.send("Get an existing workout");
});

router.post("/", (req, res) => {
  
  medicoController.agregarMedico(req,res);
});

router.patch("/:clienteId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:clienteId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;