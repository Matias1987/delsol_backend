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

const editarCobro = (req, res) => {}

module.exports = {
    obtenerCobros,
    agregarCobro,
    obtenerCobro,
    editarCobro,
  };