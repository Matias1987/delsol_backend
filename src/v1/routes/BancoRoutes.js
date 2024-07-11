const express = require("express");
const router = express.Router();
const bancoController = require("../../controllers/BancoController")

router.get("/", (req, res) => {
  bancoController.obtenerBancos(req,res)
});

router.get("/:bancoId", (req, res) => {
  //bancoController.obtenerBancos(req,res)
});

router.post("/", (req, res) => {
  bancoController.agregarBanco(req,res)
});

router.post("/de/b/", (req, res) => {
  bancoController.desactivar_banco(req,res)
});

router.patch("/:clienteId", (req, res) => {
  bancoController.editarBanco(req,res)
});

router.delete("/:clienteId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;