const MedicoDB = require("../database/Medico");

const ventas_medico = (data, callback)=>{
    MedicoDB.ventas_medico(data,(rows)=>{
        return callback(rows)
    })
}

const ventas_medico_totales = (data,callback)=>{
    MedicoDB.ventas_medico_totales(data,(rows)=>{
        return callback(rows)
    })
}

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

const deshabilitar_medico = (data,callback) => {
    MedicoDB.deshabilitar_medico(data,(resp)=>{
        return callback(resp)
    })
}

const editarMedico = (req,res) => {}

module.exports = {
    deshabilitar_medico,
    obtenerMedico,
    obtenerMedicos,
    agregarMedico,
    editarMedico,
    buscarMedico,
    ventas_medico_totales,
    ventas_medico,
}