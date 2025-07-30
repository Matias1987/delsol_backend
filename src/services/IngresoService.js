const Ingreso = require("../database/Ingreso");

// Create ingreso
function createIngreso(params, callback) {
    Ingreso.createEgreso(params, callback);
}

// Get all ingresos
function getAllIngresos(callback) {
    Ingreso.getAll(callback);
}

// Get ingreso by ID
function getIngresoById(params, callback) {
    Ingreso.getById(params.id, callback);
}

// Update ingreso
function updateIngreso(params, callback) {
    Ingreso.update(params.id, params.data, callback);
}

// Delete ingreso
function deleteIngreso(params, callback) {
    Ingreso.delete(params.id, callback);
}

module.exports = {
    createIngreso,
    getAllIngresos,
    getIngresoById,
    updateIngreso,
    deleteIngreso
};