const express = require("express");
const router = express.Router();
const grupoController = require("../../controllers/GrupoController")

router.get("/", (req, res) => {
  res.send("Obtener todos los grupos");
});

router.get("/:grupoId", (req, res) => {
  res.send("Get an existing workout");
});

router.get("/optionsforsubfamilia/:subfamiliaId", (req, res) => {
  grupoController.obtener_grupos_bysubfamilia_opt(req,res);
});

router.post("/", (req, res) => {
  grupoController.agregarGrupo(req,res);
});

router.patch("/:grupoId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:grupoId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;