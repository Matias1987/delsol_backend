const TarjetaDB = require("../database/Tarjeta")

const obtenerTarjetas = (callback) => {
    TarjetaDB.obtener_tarjetas((rows)=>{return callback(rows)})
}

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