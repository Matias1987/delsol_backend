const FondoFijo = require("../database/FondoFijo");

// Create FondoFijo
function createFondoFijo(params, callback) {
    FondoFijo.create(params, callback);
}

// Get all FondoFijo
function getAllFondoFijo(callback) {
    FondoFijo.getAll((rows)=>{
        callback(rows)
    });
}

// Get FondoFijo by ID
function GetOperacionesFF(params, callback) {
    FondoFijo.GetOperacionesFF(params, (response)=>{
        return callback(response)
    });
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
    GetOperacionesFF,
    updateFondoFijo,
    deleteFondoFijo,
};