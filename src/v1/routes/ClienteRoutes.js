const express = require("express");
const router = express.Router();

const clienteController = require("../../controllers/ClienteController")

router.get("/", (req, res) => {
  clienteController.obtenerClientes(req,res);
});

router.get("/buscar/:values", (req, res) => {
  clienteController.buscarCliente(req,res);
});

router.get("/:clienteId", (req, res) => {
 clienteController.obtenerClientePorID(req,res)
});

router.post("/", (req, res) => {
  clienteController.agregarCliente(req,res);
});

router.post("/getPorDNI/", (req, res) => {
  clienteController.obtenerClientePorDNI(req,res);
});

router.patch("/:clienteId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:clienteId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;