const MedicoDB = require("../database/Medico");

const obtenerMedicos = (req,res) => {

}

const obtenerMedico = (req,res) => {}

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
    editarMedico
}