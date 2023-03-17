const GastoDB = require("../database/Gasto")


const obtenerGastos = (req,res) => {}

const obtenerGasto = (req,res) => {}

const agregarGasto = (data,callback) => {
    GastoDB.agregar_gasto(data,(id)=>{
        return callback(id);
    })
}

const editarGasto = (req,res) => {}


module.exports = {
    obtenerGasto,
    obtenerGastos,
    agregarGasto,
    editarGasto
}