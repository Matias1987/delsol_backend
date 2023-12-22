const ventaDB = require("../database/Venta")

const lista_ventas_sucursal_mes = (data, callback) => {
  ventaDB.lista_ventas_sucursal_mes(data,(rows)=>{
    callback(rows)
  })
}

const lista_ventas_vendedor_mes = (data, callback) => {
  ventaDB.lista_ventas_vendedor_mes(data,(rows)=>{
    callback(rows)
  })
}

const totales_venta_vendedor = (data, callback) => {
  ventaDB.totales_venta_vendedor(data,(rows)=>{
    callback(rows)
  })
}

const cambiar_estado_venta = (data,callback) => {
  ventaDB.cambiar_estado_venta(data,(results)=>{
    callback(results)
  })
}
const desc_cantidades_stock_venta = (data,callback) => {
  ventaDB.desc_cantidades_stock_venta(data,(results)=>{
    callback(results)
  })
}
const inc_cantidades_stock_venta = (data,callback) => {
  ventaDB.inc_cantidades_stock_venta(data,(results)=>{
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

const obtener_datos_pagare = (data, callback) => {
  ventaDB.obtener_datos_pagare(data,(data)=>{
    return callback(data)
  })
}

const obtener_lista_pagares = (data, callback) => {
  ventaDB.obtener_lista_pagares(data,(rows)=>{
    return callback(rows)
  })
}

const obtener_categorias_productos_venta = (data, callback) => {
  ventaDB.obtener_categorias_productos_venta(data,(rows)=>{
    return callback(rows)
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
    desc_cantidades_stock_venta,
    inc_cantidades_stock_venta,
    obtener_datos_pagare,
    obtener_lista_pagares,
    obtener_categorias_productos_venta,
    totales_venta_vendedor,
    lista_ventas_vendedor_mes,
    lista_ventas_sucursal_mes,
  };