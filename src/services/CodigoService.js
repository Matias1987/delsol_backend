const CodigoDB = require("../database/Codigo")

const obtenerCodigo = (req, res) => {}
const obtenerCodigos = (callback) => {
  CodigoDB.obtener_codigos((rows)=>{
    return callback(rows)
  })
}
const agregarCodigo = (data,callback) => {
  CodigoDB.agregar_codigo(data,(id)=>{
    return callback(id);
  })
}
const editarCodigo = (req, res) => {}

const obtener_codigos_bysubgrupo_opt = (idsubgrupo,callback) =>{
  CodigoDB.obtener_codigos_bysubgrupo_opt(idsubgrupo,(rows)=>{
    return callback(rows);
  })
}

module.exports = {
    obtenerCodigo,
    obtenerCodigos,
    agregarCodigo,
    editarCodigo,
    obtener_codigos_bysubgrupo_opt,
  };