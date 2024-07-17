const express = require("express");

const proveedorController = require("../../controllers/ProveedorController");

const router = express.Router();

router.get("/", (req, res) => {
    proveedorController.obtener_proveedores(req,res)
});

router.get("/:proveedorId", (req, res) => {
  proveedorController.detalle_proveedor(req, res)
});

router.post("/", (req, res) => {
  proveedorController.agregar_proveedor(req,res)
});

router.post("/prov/ficha/",(req,res)=>{
  proveedorController.obtener_ficha_proveedor(req, res)
});

router.patch("/:proveedorId", (req, res) => {
  res.send("actualizar una proveedor");
});

router.delete("/:proveedorId", (req, res) => {
  res.send("eliminar proveedor (logica)");
});

module.exports = router;