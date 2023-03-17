const CodigoDB = require("../database/Codigo")

const obtenerCodigo = (req, res) => {}
const obtenerCodigos = (req, res) => {}
const agregarCodigo = (data,callback) => {
  CodigoDB.agregar_codigo(data,(id)=>{
    return callback(id);
  })
}
const editarCodigo = (req, res) => {}

module.exports = {
    obtenerCodigo,
    obtenerCodigos,
    agregarCodigo,
    editarCodigo,
  };