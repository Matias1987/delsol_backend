const express = require("express");
const router = express.Router();
const codigoController = require("../../controllers/CodigoController")

router.get("/", (req, res) => {
  codigoController.obtenerCodigos(req,res)
});

router.get("/:codigoId", (req, res) => {
  res.send("Get an existing workout");
});

router.get("/optforsubgrupo/:subgrupoId", (req, res) => {
  codigoController.obtener_codigos_bysubgrupo_opt(req,res);
});

router.post("/", (req, res) => {
  codigoController.agregarCodigo(req,res);
});

router.patch("/:codigoId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:codigoId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;