const stockService = require("../services/StockService")

const search_stock = (req,res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  const {params:{idsucursal, search_value}} = req;

  stockService.search_stock(search_value,idsucursal,(rows)=>{
    return res.status(201).send({status:'OK', data:rows});
  })

}

const obtener_detalle_stock_sucursal = (req,res)=>{
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {params:{idsucursal,idcodigo}} = req;
  stockService.obtener_detalle_stock_sucursal(idsucursal,idcodigo,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const obtener_stock_por_subgrupo = (req,res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {params:{idsubgrupo}} = req;
  stockService.obtener_stock_por_subgrupo(idsubgrupo,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

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
    obtener_stock_por_subgrupo,
    obtener_detalle_stock_sucursal,
    search_stock,
  };