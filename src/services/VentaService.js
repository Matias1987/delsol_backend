const ventaDB = require("../database/Venta")

const obtenerVentas = (callback) => {
  ventaDB.lista_ventas((rows)=>{
    callback(rows)
  })
}
const obtenerVentasSucursal = (data, callback) => {
  ventaDB.lista_ventas(data,(rows)=>{
    callback(rows)
  })
}

const agregarVenta = (data,callback) => {
  ventaDB.agregar_venta(data, (id) => {
    return callback(id);
  })
}
const obtenerVenta = (data,callback) => {
  ventaDB.detalle_venta(data,(row)=>{
    return callback(row);
  })
}
const editarVenta = (req, res) => {}

module.exports = {
    obtenerVentas,
    obtenerVentasSucursal,
    agregarVenta,
    obtenerVenta,
    editarVenta,
  };