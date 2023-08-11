const ventaDB = require("../database/Venta")

const cambiar_estado_venta = (data,callback) => {
  ventaDB.cambiar_estado_venta(data,(results)=>{
    callback(results)
  })
}
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
  ventaDB.insert_venta(data, (id) => {
    return callback(id);
  })
}
const obtenerVenta = (data,callback) => {
  ventaDB.detalle_venta(data,(row)=>{
    return callback(row);
  })
}

const obtenerVentaMP = (idventa,callback) => {
  ventaDB.lista_venta_mp(idventa,(row)=>{
    return callback(row);
  })
}
const obtenerVentaMPCtaCte = (idventa,callback) => {
  ventaDB.lista_venta_mp_cta_cte(idventa,(row)=>{
    return callback(row);
  })
}

const lista_venta_sucursal_estado = (data,callback) => {
  ventaDB.lista_venta_sucursal_estado(data,(rows)=>{
    return callback(rows)
  })
}

const editarVenta = (req, res) => {}

const lista_venta_item = (idventa, callback) => {
  ventaDB.lista_venta_item(idventa,(rows)=>{
    return callback(rows)
  })
}

const cambiar_venta_sucursal_deposito = (en_laboratorio, idventa, callback) =>{
  ventaDB.cambiar_venta_sucursal_deposito(en_laboratorio,idventa,(resp)=>{
    return callback(resp)
  })
}

module.exports = {
    lista_venta_item ,
    obtenerVentas,
    obtenerVentasSucursal,
    agregarVenta,
    obtenerVenta,
    editarVenta,
    obtenerVentaMP,
    lista_venta_sucursal_estado,
    cambiar_estado_venta,
    obtenerVentaMPCtaCte,
    cambiar_venta_sucursal_deposito,
  };