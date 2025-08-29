const service = require("../services/EgresoService");
// Get all egresos
function obtenerEgresos(req, res) {
    service.getAllEgresos((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}

// Get egreso by ID
function obtenerEgresoPorId(req, res) {
    const id = req.params.id;
    service.getEgresoById(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!result) return res.status(404).json({ error: "Egreso not found" });
        res.json(result);
    });
}

// Create new egreso
function crearEgreso(req, res) {
    service.createEgreso(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(result);
    });
}

// Update egreso by ID
function actualizarEgreso(req, res) {
    const id = req.params.id;
    Egreso.update(id, req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
}

// Delete egreso by ID
function eliminarEgreso(req, res) {
    const id = req.params.id;
    Egreso.delete(id, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Egreso deleted" });
    });
}

module.exports = {
    obtenerEgresos,
    obtenerEgresoPorId,
    crearEgreso,
    actualizarEgreso,
    eliminarEgreso
}