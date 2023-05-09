const sucursalService = require("../services/SucursalService")

const obtenerSucursales = (req, res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  sucursalService.obtenerSucursales((row)=>{
    res.status(201).send({status:'OK',data:row});
  })

}

const obtenerSucursal = (req, res) => {
  const {params:{idsucursal}} = req;
  sucursalService.obtenerDetalleSucursal(idsucursal,(resp)=>{
    res.status(201).send({status:'OK',data:resp});
  })
}

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