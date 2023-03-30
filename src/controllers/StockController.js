const stockService = require("../services/StockService")

const obtenerListaStock = (req, res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  stockService.obtenerListaStock(null,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const obtenerStock = (req, res) =>{}

const agregarStock = (req, res) => {
  const {body} = req;

  const nuevo_stock = {
    'sucursal_idsucursal':body.sucursal_idsucursal,
    'codigo_idcodigo':body.codigo_idcodigo,
    'cantidad':body.cantidad,
  }

  stockService.agregarStock(nuevo_stock,(id)=>{
    res.status(201).send({status:'OK', data:id});
  })

}

const editarStock = (req, res) => {}


module.exports = {
    obtenerListaStock,
    obtenerStock,
    agregarStock,
    editarStock,
  };