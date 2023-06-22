const express = require("express");
const mutualController = require("../../controllers/MutualController");
const router = express.Router();

router.get("/", (req, res) => {
  mutualController.obtenerMutuales(req,res);
});

router.get("/:idmutual", (req, res) => {
  mutualController.obtenerMutual(req,res)
});
router.get("/buscar/:value", (req, res) => {
  mutualController.buscarMutual(req,res)
});

router.post("/", (req, res) => {
  mutualController.agregarMutual(req,res);
});

router.patch("/:clienteId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:clienteId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;