const familiaDB = require("../database/Familia");

const obtenerFamilias = (req, res) => {}

const obtenerFamilia = (req, res) => {}

const agregarFamilia = (data, callback) => {
  familiaDB.agregar_familia(data,()=>{
    return callback();
  })
}

const editarFamilia = (req, res) => {}


module.exports = {
    obtenerFamilias,
    obtenerFamilia,
    agregarFamilia,
    editarFamilia,
  };