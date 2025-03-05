const SucursalDB = require("../database/Sucursal")

const obtenerDetalleSucursal = (idsucursal, callback) => {
  SucursalDB.obtener_detalle_sucursal(idsucursal, (resp)=>{
    return callback(resp)
  })
}

const obtenerSucursales = (callback) => {
  SucursalDB.obtener_sucursales((rows)=>{
    return callback(rows)
  })

}

const obtenerSucursal = (req, res) => {}

const agregarSucursal = (data, callback) => {
  SucursalDB.agregar_sucursal(data,(id)=>{
    return callback(id);
  })
}

const editarSucursal = (data, callback) => {
  SucursalDB.actualizar_sucursal(data,(response)=>{
    return callback(response)
  })
}



module.exports = {
    obtenerSucursales,
    obtenerSucursal,
    agregarSucursal,
    editarSucursal,
    obtenerDetalleSucursal,
  };