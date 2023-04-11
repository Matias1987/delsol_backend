const EnvioStockDB = require("../database/EnvioHasStock")

const obtenerEnvioStock = (idenvio, callback) => {
    EnvioStockDB.obtener_lista_envio_stock(
        idenvio,
        (rows)=>{
            return callback(rows)
        }
    )
}
const agregarEnvioStock = (req,res) => {}
const editarEnvioStock = (req,res) => {}
const eliminarEnvioStock = (req,res) => {}

module.exports = {
    obtenerEnvioStock,
    agregarEnvioStock,
    editarEnvioStock,
    eliminarEnvioStock
}