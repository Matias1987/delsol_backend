const express = require("express");
const router = express.Router();
const tarjetaController = require("../../controllers/TarjetaController")

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.get("/:sucursalId", (req, res) => {
  res.send("Get an existing workout");
});

router.post("/", (req, res) => {
    tarjetaController.agregarTarjeta(req,res);
});

router.patch("/:sucursalId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:sucursalId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;