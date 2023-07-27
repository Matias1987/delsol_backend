const CobroDB = require("../database/Cobro")

const obtenerCobros = (data,callback) => {
  CobroDB.lista_cobros(data, (rows)=>{
    return callback(rows)
  })
}

const agregarCobro = (data,callback) => {
  CobroDB.agregar_cobro(data,(id)=>{
    return callback(id);
  })
}

const obtenerCobro = (idcobro, callback) => {
  CobroDB.detalle_cobro(idcobro,(row)=>{
    return callback(row)
  })
}

const lista_mp_cobro = (idcobro, callback) => {
  CobroDB.lista_mp_cobro(idcobro,(rows)=>{
    return callback(rows)
  })
}

const editarCobro = (req, res) => {}

module.exports = {
    obtenerCobros,
    agregarCobro,
    obtenerCobro,
    editarCobro,
    lista_mp_cobro,
  };