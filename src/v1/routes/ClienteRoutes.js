const express = require("express");
const router = express.Router();

const clienteController = require("../../controllers/ClienteController")

router.get("/", (req, res) => {
  clienteController.obtenerClientes();
});

router.get("/:clienteId", (req, res) => {
  res.send("Get an existing workout");
});

router.post("/", (req, res) => {
  clienteController.agregarCliente(req,res);
});

router.patch("/:clienteId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:clienteId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;