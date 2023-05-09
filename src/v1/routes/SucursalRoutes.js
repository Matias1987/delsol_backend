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

router.patch("/:sucursalId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:sucursalId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;