const SucursalDB = require("../database/Sucursal")

const obtenerSucursales = (req, res) => {}

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