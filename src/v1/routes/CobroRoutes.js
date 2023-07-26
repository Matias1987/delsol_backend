const express = require("express");
const router = express.Router();
const cobroController = require("../../controllers/CobroController")

router.get("/", (req, res) => {
  res.send("obtener todos los cobros");
});

router.get("/:cobroId", (req, res) => {
  cobroController.obtenerCobro(req,res)
});

router.post("/", (req, res) => {
  cobroController.agregarCobro(req,res);
});

router.post("/lista/", (req, res) => {
  cobroController.obtenerCobros(req,res);
});

router.patch("/:cobroId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:cobroId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;