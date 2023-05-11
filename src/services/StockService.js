const StockDB = require("../database/Stock")


const modificar_cantidad = (idcodigo, idsucursal, cantidad, callback) => {
  StockDB.modificar_cantidad(idcodigo,idsucursal,cantidad,(data)=>{
    callback(data)
  })
}

const search_stock = (search_value, idsucursal, callback) => {
  StockDB.search_stock(search_value,idsucursal,(rows)=>{
    return callback(rows);
  })

}

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


module.exports = {
    obtenerListaStock,
    obtenerStock,
    agregarStock,
    editarStock,
    obtener_stock_por_subgrupo,
    obtener_detalle_stock_sucursal,
    search_stock,
    modificar_cantidad,
    obtener_codigos_sin_stock_sucursal,
    agregar_stock_lote,
  };