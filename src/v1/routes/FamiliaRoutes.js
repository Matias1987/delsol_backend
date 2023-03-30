const express = require("express");
const router = express.Router();
const familiaController = require("../../controllers/FamiliaController");

router.get("/", (req, res) => {
  familiaController.obtenerFamilias(req,res)
});

router.get("/:familiaId", (req, res) => {
  res.send("obtener una familia con id");
});

router.get("/menu/options/", (req, res) => {
  familiaController.obtener_familias_opt(req,res)
});



router.post("/", (req, res) => {
  familiaController.agregarFamilia(req,res);
});

router.patch("/:familiaId", (req, res) => {
  res.send("actualizar una familia");
});

router.delete("/:familiaId", (req, res) => {
  res.send("eliminar una familia (logica)");
});

module.exports = router;