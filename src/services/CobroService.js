const CobroDB = require("../database/Cobro")

const obtenerCobros = (req, res) => {}

const agregarCobro = (data,callback) => {
  CobroDB.agregar_cobro(data,(id)=>{
    return callback(id);
  })
}

const obtenerCobro = (req, res) => {}

const editarCobro = (req, res) => {}

module.exports = {
    obtenerCobros,
    agregarCobro,
    obtenerCobro,
    editarCobro,
  };