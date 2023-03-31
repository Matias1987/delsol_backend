const StockDB = require("../database/Stock")

const obtener_detalle_stock_sucursal = (idsucursal, idcodigo,callback) => {
  return StockDB.obtener_detalle_stock_sucursal(idsucursal,idcodigo,(rows)=>{
    return callback(rows)
  })
}

const obtener_stock_por_subgrupo = (subgrupoid, callback) => {
  return StockDB.obtener_stock_por_subgrupo(subgrupoid,(rows)=>{
    return callback(rows);
  })
}

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
    obtener_stock_por_subgrupo,
    obtener_detalle_stock_sucursal,
  };