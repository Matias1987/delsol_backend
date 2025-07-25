const express = require("express");
const EgresoController = require("../../controllers/EgresoController");
const router = express.Router();

// Get all egresos
router.get("/", (req, res) => {
    EgresoController.obtenerEgresos(req, res);
});

// Get egreso by ID
router.get("/:id", (req, res) => {
    EgresoController.obtenerEgresoPorId(req, res);
});

// Create new egreso
router.post("/", (req, res) => {
    EgresoController.crearEgreso(req, res);
});

// Update egreso by ID
router.put("/:id", (req, res) => {
    EgresoController.actualizarEgreso(req, res);
});

// Delete egreso by ID
router.delete("/:id", (req, res) => {
    EgresoController.eliminarEgreso(req, res);
});

module.exports = router;