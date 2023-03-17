const TarjetaDB = require("../database/Tarjeta")

const obtenerTarjetas = (req,res) => {}

const obtenerTarjeta = (req,res) => {}

const agregarTarjeta = (data,callback) => {
    TarjetaDB.agregar_tarjeta(data,(id)=>{return callback(id)});
}

const editarTarjeta = (req,res) => {}


module.exports = {
    obtenerTarjeta,
    obtenerTarjetas,
    agregarTarjeta,
    editarTarjeta
}