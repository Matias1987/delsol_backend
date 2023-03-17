const express = require("express");
const router = express.Router();
const subGrupoController = require("../../controllers/SubGrupoController");

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.get("/:subgrupoId", (req, res) => {
  res.send("Get an existing workout");
});

router.post("/", (req, res) => {
  subGrupoController.agregarSubgrupo(req,res);
});

router.patch("/:subgrupoId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:subgrupoId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;