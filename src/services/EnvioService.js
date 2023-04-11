const EnvioDB = require("../database/Envio")

const obtenerEnvio = (idenvio, callback) => {
    EnvioDB.detalle_envio(idenvio,(rows)=>{
        return callback(rows);
    })
}

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
    obtenerEnvio,
    obtenerEnvios,
    agregarEnvio,
    editarEnvio
}