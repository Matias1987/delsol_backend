const express = require("express");
const controller = require("../../controllers/MovilController");
const router = express.Router();

router.post("/operaciones/", (req, res) => {
  controller.insert(req, res);
});

router.get("/sucursales/", (req, res) => {
  controller.obtenerSucursales(req, res);
})

router.get("/vendedores/", (req, res) => {
  controller.obtenerVendedores(req, res);
})

module.exports = router;
