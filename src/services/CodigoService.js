const CodigoDB = require("../database/Codigo")

const search_codigos = (data,callback) => {
  CodigoDB.search_codigos(data,(rows)=>{
    return callback(rows)
  })
}

const obtenerCodigoPorID = (idcodigo, callback) => {
  CodigoDB.obtener_codigo_por_id(idcodigo,(rows)=>{
    return callback(rows)
  })
}

const obtenerCodigo = (codigo, callback) => {
  CodigoDB.obtener_codigo(codigo,(rows)=>{
    return callback(rows)
  })
}
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
    obtenerCodigoPorID,
    obtenerCodigos,
    agregarCodigo,
    editarCodigo,
    obtener_codigos_bysubgrupo_opt,
    search_codigos,
    obtenerCodigo,
  };