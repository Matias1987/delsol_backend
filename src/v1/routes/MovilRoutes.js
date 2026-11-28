const express = require("express");
const controller = require("../../controllers/MovilController");
const router = express.Router();

router.post("/add/", (req, res) => {
  controller.insert(req, res);
});

router.get("/sucursales/", (req, res) => {
  controller.obtenerSucursales(req, res);
});

router.get("/vendedores/", (req, res) => {
  controller.obtenerVendedores(req, res);
});

router.get("/operaciones", (req, res) => {
  controller.listarOperacionesMovil(req, res);
});

module.exports = router;
