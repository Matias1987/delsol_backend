const TarjetaDB = require("../database/Tarjeta")

const obtenerTarjetas = (callback) => {
    TarjetaDB.obtener_tarjetas((rows)=>{return callback(rows)})
}

const obtenerTarjeta = (req,res) => {}

const agregarTarjeta = (data,callback) => {
    TarjetaDB.agregar_tarjeta(data,(id)=>{return callback(id)});
}

const editarTarjeta = (req,res) => {

}

const desactivar_tarjeta = (data,callback) => {
    TarjetaDB.desactivar_tarjeta(data,(resp)=>{
        callback(resp)
    })
}

const cobros_tarjeta = (data,callback) => {
    TarjetaDB.cobros_tarjeta(data,(resp)=>{
        callback(resp)
    })
}

module.exports = {
    desactivar_tarjeta,
    obtenerTarjeta,
    obtenerTarjetas,
    agregarTarjeta,
    editarTarjeta,
    cobros_tarjeta,
}