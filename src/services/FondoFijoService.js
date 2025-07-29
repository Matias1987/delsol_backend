const FondoFijo = require("../database/FondoFijo");

// Create FondoFijo
function createFondoFijo(params, callback) {
    FondoFijo.create(params, callback);
}

// Get all FondoFijo
function getAllFondoFijo(callback) {
    FondoFijo.getAll(callback);
}

// Get FondoFijo by ID
function getFondoFijoById(params, callback) {
    FondoFijo.getById(params.id, callback);
}

// Update FondoFijo
function updateFondoFijo(params, callback) {
    FondoFijo.update(params.id, params.data, callback);
}

// Delete FondoFijo
function deleteFondoFijo(params, callback) {
    FondoFijo.delete(params.id, callback);
}

module.exports = {
    createFondoFijo,
    getAllFondoFijo,
    getFondoFijoById,
    updateFondoFijo,
    deleteFondoFijo,
    getFondoFijoById
};