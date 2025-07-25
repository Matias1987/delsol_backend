const Ingreso = require("../database/Ingreso");

// Get all ingresos
function obtenerIngresos(req, res) {
    Ingreso.getAll((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

// Get ingreso by ID
function obtenerIngresoPorId(req, res) {
    const id = req.params.id;
    Ingreso.getById(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!result) return res.status(404).json({ error: "Ingreso not found" });
        res.json(result);
    });
}

// Create new ingreso
function crearIngreso(req, res) {
    Ingreso.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(result);
    });
}

// Update ingreso by ID
function actualizarIngreso(req, res) {
    const id = req.params.id;
    Ingreso.update(id, req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
}

// Delete ingreso by ID
function eliminarIngreso(req, res) {
    const id = req.params.id;
    Ingreso.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Ingreso deleted" });
    });
}

module.exports = {
    obtenerIngresos,
    obtenerIngresoPorId,
    crearIngreso,
    actualizarIngreso,
    eliminarIngreso,
}
