const stockService = require("../services/StockService")


const modificar_cantidad = (req, res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  const {body} = req;
  
  stockService.modificar_cantidad(
    {
      idcodigo: body.idcodigo, 
    
      idsucursal: body.idsucursal, 
    
      cantidad: body.cantidad, 
    
      fkfactura: (typeof body.factura_idfactura === 'undefined' ? -1 : body.factura_idfactura),
      
      costo: (typeof body.costo === 'undefined' ? 0 : body.costo),
    }
    ,
    (data)=>{
    return res.status(201).send({status:'OK', data:data});
  })

}

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
  
  const {params:{idsucursal}} = req;


  stockService.obtenerListaStock(idsucursal,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const agregarStock = (req, res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  const {body} = req;

  const nuevo_stock = {
    'factura_idfactura': (typeof body.factura_idfactura === 'undefined' ? -1 : body.factura_idfactura),
    'costo': (typeof body.costo === 'undefined' ? 0 : body.costo),
    'sucursal_idsucursal':body.sucursal_idsucursal,
    'codigo_idcodigo':body.codigo_idcodigo,
    'cantidad':body.cantidad,
  }

  stockService.agregarStock(nuevo_stock,(id)=>{
    res.status(201).send({status:'OK', data:id});
  })

}

const obtener_codigos_sin_stock_sucursal = (req,res) => {
  const {params:{idsucursal}} = req;
  stockService.obtener_codigos_sin_stock_sucursal(idsucursal,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })

}

const agregar_stock_lote = (req,res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

 

  
  const {body} = req;

  console.log(JSON.stringify(body))

  stockService.agregar_stock_lote(body,(result)=>{
    res.status(201).send({status:'OK', data:result});
  })
  
}

const obtener_stock_sucursal = (req,res)=> {
  const {params:{idsucursal, idcodigo}} = req;
  stockService.obtener_stock_sucursal(idsucursal, idcodigo,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const editarStock = (req, res) => {}


module.exports = {
    obtenerListaStock,
    agregarStock,
    editarStock,
    obtener_stock_por_subgrupo,
    obtener_detalle_stock_sucursal,
    search_stock,
    modificar_cantidad,
    obtener_codigos_sin_stock_sucursal,
    agregar_stock_lote,
    obtener_stock_sucursal,
  };