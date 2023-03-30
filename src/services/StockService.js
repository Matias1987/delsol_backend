const StockDB = require("../database/Stock")


const obtenerListaStock = (data,callback) => {
  return StockDB.obtener_stock(null,(rows)=>{
    return callback(rows)
  })
}

const obtenerStock = (req, res) =>{}

const agregarStock = (data, callback) => {
  StockDB.agregar_stock(data,(id)=>{
    return callback(id)
  })
}

const editarStock = (req, res) => {}


module.exports = {
    obtenerListaStock,
    obtenerStock,
    agregarStock,
    editarStock,
  };