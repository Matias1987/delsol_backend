const express = require("express");
const Ingreso = require("../../controllers/IngresoController");
const router = express.Router();

// Get all ingresos
router.get("/", (req, res) => {
    Ingreso.obtenerIngresos(req, res);
});

// Get ingreso by ID
router.get("/:id", (req, res) => {
    Ingreso.obtenerIngresoPorId(req, res);
});

// Create new ingreso
router.post("/", (req, res) => {
    Ingreso.crearIngreso(req, res);
});

// Update ingreso by ID
router.put("/:id", (req, res) => {
    Ingreso.actualizarIngreso(req, res);
});

// Delete ingreso by ID
router.delete("/:id", (req, res) => {
    Ingreso.eliminarIngreso(req, res);
});

module.exports = router;