const stockService = require("../services/StockService")

const obtenerListaStock = (req, res) => {}

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