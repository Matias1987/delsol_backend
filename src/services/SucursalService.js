const SucursalDB = require("../database/Sucursal")

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

const editarSucursal = (req, res) => {}



module.exports = {
    obtenerSucursales,
    obtenerSucursal,
    agregarSucursal,
    editarSucursal,
  };