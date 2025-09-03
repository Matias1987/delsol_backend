const FondoFijoService = require("../services/FondoFijoService");

// Get all FondoFijo
function obtenerFondoFijos(req, res) {
    FondoFijoService.getAllFondoFijo((results) => {
        res.json(results);
    });
}

// Get FondoFijo by ID
function GetOperacionesFF(req, res) {
    const {body} = req;
    FondoFijoService.GetOperacionesFF(body, (result) => {
       // if (err) return res.status(500).json({ error: err.message });
        if (!result) return res.status(404).json({ error: "FondoFijo not found" });
        res.json(result);
    });
}

// Create new FondoFijo
function crearFondoFijo(req, res) {
    FondoFijoService.createFondoFijo(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(result);
    });
}

// Update FondoFijo by ID
function actualizarFondoFijo(req, res) {
    FondoFijoService.updateFondoFijo({ id: req.params.id, data: req.body }, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
}

// Delete FondoFijo by ID
function eliminarFondoFijo(req, res) {
    FondoFijoService.deleteFondoFijo({ id: req.params.id }, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "FondoFijo deleted" });
    });
}

module.exports = {
    obtenerFondoFijos,
    GetOperacionesFF,
    crearFondoFijo,
    actualizarFondoFijo,
    eliminarFondoFijo
};