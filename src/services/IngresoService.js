 const db = require("../database/Ingreso");

// Create ingreso
function createIngreso(params, callback) {
    db.createIngreso(params, callback);
}

// Get all ingresos
function getAllIngresos(callback) {
    //db.getAll(callback);
}

// Get ingreso by ID
function getIngresoById(params, callback) {
    //db.getById(params.id, callback);
}

// Update ingreso
function updateIngreso(params, callback) {
    //db.update(params.id, params.data, callback);
}

// Delete ingreso
function deleteIngreso(params, callback) {
    //db.delete(params.id, callback);
}

module.exports = {
    createIngreso,
    getAllIngresos,
    getIngresoById,
    updateIngreso,
    deleteIngreso
};