const sucursalService = require("../services/SucursalService")

const obtenerSucursales = (req, res) => {}

const obtenerSucursal = (req, res) => {}

const agregarSucursal = (req, res) => {
  const {body} = req;
  const nuevo_sucursal = {
    'nombre':body.nombre
  }

  sucursalService.agregarSucursal(nuevo_sucursal,(id)=>{
    res.status(201).send({status:'OK',data:id});
  })

}

const editarSucursal = (req, res) => {}


module.exports = {
    obtenerSucursales,
    obtenerSucursal,
    agregarSucursal,
    editarSucursal,
  };