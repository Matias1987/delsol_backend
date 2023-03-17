const EnvioDB = require("../database/Envio")

const obtenerEnvios = (callback) => {
    EnvioDB.obtenerEnvios((rows)=>{
        return callback(rows);
    })
}

const agregarEnvio = (data, callback) => {
    EnvioDB.agregar_envio(
        data, (id)=>{
            return callback(id);
        }
    )
}

const editarEnvio = (req,res) => {}


module.exports = {
    obtenerEnvios,
    agregarEnvio,
    editarEnvio
}