const MedicoDB = require("../database/Medico");

const buscarMedico = (value, callback) => {
    MedicoDB.buscar_medico(value,(rows)=>{
        return callback(rows)
    })
}

const obtenerMedicos = (callback) => {
    MedicoDB.obtener_medicos((rows)=>{
        return callback(rows)
    })
}

const obtenerMedico = (id,callback) => {
    MedicoDB.obtener_medico(id,(rows)=>{
        return callback(rows)
    })
}

const agregarMedico = (data,callback) => {
    MedicoDB.agregar_medico(data,(medico_id)=>{
        return callback(medico_id);
    })
}
const editarMedico = (req,res) => {}

module.exports = {
    obtenerMedico,
    obtenerMedicos,
    agregarMedico,
    editarMedico,
    buscarMedico,
}