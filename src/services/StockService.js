const StockDB = require("../database/Stock")

const verificar_cantidades_productos = (data,callback) => {
  StockDB.verificar_cantidades_productos(data,(resp)=>{
    callback(resp)
  })
}

const obtener_subgrupo_full = (callback) => {
  StockDB.obtener_subgrupo_full((rows)=>{
    return callback(rows)
  })
}

const incrementar_cantidad = (idcodigo, idsucursal, cantidad,fkfactura, callback) => {
  StockDB.incrementar_cantidad(idcodigo,idsucursal,cantidad,fkfactura, (data)=>{
    callback(data)
  })
}

const search_stock = (search_value, idsucursal, callback) => {
  StockDB.search_stock(search_value,idsucursal,(rows)=>{
    return callback(rows);
  })

}

const obtener_detalle_stock_sucursal = (idsucursal, idcodigo,callback) => {
  return StockDB.obtener_detalle_stock_sucursal_v2(idsucursal,idcodigo,(rows)=>{
    return callback(rows)
  })
}

const obtener_stock_por_subgrupo = (subgrupoid, callback) => {
  return StockDB.obtener_stock_por_subgrupo(subgrupoid,(rows)=>{
    return callback(rows);
  })
}

const obtenerListaStock = (idsucursal,callback) => {
  return StockDB.obtener_stock(idsucursal,(rows)=>{
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

const obtener_codigos_sin_stock_sucursal = (idsucursal, callback) => {
  StockDB.obtener_codigos_sin_stock_sucursal(idsucursal,(rows)=>{
    return callback(rows);
  })
}

const agregar_stock_lote = (values,callback) => {
  StockDB.agregar_stock_lote(values,(result)=>{
    return callback(result)
  })
}

const obtener_stock_sucursal = (idsucursal, idcodigo, callback) => {
  StockDB.obtener_stock_sucursal(idsucursal,idcodigo,(rows)=>{
    callback(rows)
  })

}

const stock_codigo_sucursales = (idcodigo, callback) => {
  StockDB.stock_codigo_sucursales(idcodigo,(rows)=>{
    return callback(rows);
  })
}

const search_stock_envio = (search_value, idsucursal_origen, idsucursal_destino,idcodigo,idsubgrupo, callback) => {
  StockDB.search_stock_envio(search_value, idsucursal_origen, idsucursal_destino,idcodigo,idsubgrupo,(rows)=>{
    return callback(rows)
  })
}

const descontar_cantidad_por_codigo = (data, callback)=>{
  StockDB.descontar_cantidad_por_codigo(data,(response)=>{
    return callback(response);
  })
}

const obtener_lista_stock_filtros = (data,callback)=>{
  StockDB.obtener_lista_stock_filtros(data,(rows)=>{
    return callback(rows);
  })
}

const obtener_stock_ventas = (filters, callback) =>{
    StockDB.obtener_stock_ventas(filters, (rows)=>{
      return callback(rows);
    })
}

const obtener_stock_detalles_venta = (data, callback) => {
  StockDB.obtener_stock_detalles_venta(data,(rows)=>{
    return callback(rows);
  })
}

const modificar_cantidad_categoria = (data, callback) => {
        StockDB.modificar_cantidad_categoria(data,(resp)=>{
          return callback(resp)
        })
}

const modificar_cantidad = (data,callback)=>{
  StockDB.modificar_cantidad(data,(resp)=>{
    return callback(resp)
  })
}

const obtener_grilla_stock = (idsubgrupo, idsucursal, callback)=>{
  StockDB.obtener_grilla_stock(idsubgrupo, idsucursal,(rows)=>{
    return callback(rows)
  })
}

module.exports = {
  modificar_cantidad,
  obtener_subgrupo_full,
  obtenerListaStock,
  obtenerStock,
  agregarStock,
  editarStock,
  obtener_stock_por_subgrupo,
  obtener_detalle_stock_sucursal,
  search_stock,
  incrementar_cantidad,
  obtener_codigos_sin_stock_sucursal,
  agregar_stock_lote,
  obtener_stock_sucursal,
  stock_codigo_sucursales,
  search_stock_envio,
  descontar_cantidad_por_codigo,
  obtener_lista_stock_filtros,
  obtener_stock_ventas,
  obtener_stock_detalles_venta,
  modificar_cantidad_categoria,
  verificar_cantidades_productos,
  obtener_grilla_stock,
  };