const express = require("express");
const router = express.Router();
const envioStockController = require("../../controllers/EnvioHasStockController")

router.get("/", (req, res) => {
  res.send("Obtener todos los envio producto");
});

router.get("/:idenvio", (req, res) => {
  envioStockController.obtenerEnvioStock(req,res)
});

router.post("/", (req, res) => {
  res.send("Create a new workout");
});

router.patch("/:clienteId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:clienteId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;