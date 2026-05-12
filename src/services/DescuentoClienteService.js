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

const obtenerListado = (callback) =>{
    db.obtenerListado(response=>{
        callback?.(response);
    })
}

const cambiarEstadoDescuento = (data, callback) =>{
    db.cambiarEstadoDescuento(data, response=>{
        callback?.(response);
    })
}

module.exports = {
    obtenerDescuentoClienteSubgrupo,
    agregarDescuentoClienteSubgrupo,
    obtenerListado,
    cambiarEstadoDescuento,
}