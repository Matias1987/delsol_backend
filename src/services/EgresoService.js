const Egreso = require("../database/Egreso");

// Create egreso
function createEgreso(params, callback) {
    Egreso.createEgreso(params, callback);
}

// Get all egresos
function getAllEgresos(callback) {
    Egreso.getEgresoList(callback);
}

// Get egreso by ID
function getEgresoById(params, callback) {
    Egreso.getById(params.id, callback);
}

// Update egreso
function updateEgreso(params, callback) {
    Egreso.update(params.id, params.data, callback);
}

// Delete egreso
function deleteEgreso(params, callback) {
    Egreso.delete(params.id, callback);
}

module.exports = {
    createEgreso,
    getAllEgresos,
    getEgresoById,
    updateEgreso,
    deleteEgreso
};