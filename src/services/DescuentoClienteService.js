const db = require("../database/DescuentoCliente");

const obtenerDescuentoClienteSubgrupo = (data, callback) => {
    db.obtenerDescuentoClienteSubgrupo(data, (response)=>{
        callback(response);
    })
}

const agregarDescuentoClienteSubgrupo = (data, callback) => {
    db.agregarDescuentoClienteSubgrupo(data, (response)=>{
        callback(response);
    });
}

module.exports = {
    obtenerDescuentoClienteSubgrupo,
    agregarDescuentoClienteSubgrupo
}