const express = require("express");
const mutualController = require("../../controllers/MutualController");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Obtener todos los clientes");
});

router.get("/:clienteId", (req, res) => {
  res.send("Get an existing workout");
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