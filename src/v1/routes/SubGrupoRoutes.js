const express = require("express");
const router = express.Router();
const subGrupoController = require("../../controllers/SubGrupoController");

router.get("/", (req, res) => {
  subGrupoController.obtenerSubgrupos(req,res)
});

router.get("/:subgrupoId", (req, res) => {
  subGrupoController.obtener_detalle_subgrupo(req,res)
});

router.get("/optionsforgrupo/:grupoId", (req, res) => {
  subGrupoController.obtener_subgrupos_bygrupo_opt(req,res);
});

router.post("/", (req, res) => {
  subGrupoController.agregarSubgrupo(req,res);
});

router.post("/modificar_multiplicador/", (req, res) => {
  console.log("modificar mult.")
  subGrupoController.modificar_multiplicador(req,res)
});

router.patch("/:subgrupoId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:subgrupoId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;