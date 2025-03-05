const express = require("express");
const router = express.Router();
const sucursalController = require("../../controllers/SucursalController")

router.get("/", (req, res) => {
  sucursalController.obtenerSucursales(req,res)
});

router.get("/:idsucursal", (req, res) => {
  sucursalController.obtenerSucursal(req,res)
});

router.post("/", (req, res) => {
  sucursalController.agregarSucursal(req,res);
});
router.post("/edit/", (req, res) => {
  sucursalController.editarSucursal(req,res);
});



module.exports = router;