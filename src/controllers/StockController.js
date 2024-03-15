const stockService = require("../services/StockService")

const verificar_cantidades_productos = (req, res) => {
  const {body} = req;
  stockService.verificar_cantidades_productos(
    body,
    (resp)=>{
      return res.status(201).send({status:'OK', data:resp});
    }
  ) 
}

const modificar_cantidad_categoria = (req, res) => {
        const {body} = req
        console.log(JSON.stringify(body))
        stockService.modificar_cantidad_categoria(body,(resp)=>{
          return res.status(201).send({status:'OK', data:resp});
        })
}

const incrementar_cantidad = (req, res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  const {body} = req;
  
  stockService.incrementar_cantidad(
    {
      codigos: body.codigos,//<--array 
    
      idsucursal: body.idsucursal, 
    
      cantidad: body.cantidad, 
    
      fkfactura: (typeof body.factura_idfactura === 'undefined' ? -1 : body.factura_idfactura),
      
      costo: (typeof body.costo === 'undefined' ? -1 : body.costo),

      descripcion: body.descripcion,
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

const stock_codigo_sucursales = (req, res) => {
  const {params:{idcodigo}} = req;
  stockService.stock_codigo_sucursales(idcodigo,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })

}

const search_stock_envio = (req,res)=>{
  const {params:{idsucursal, idsucursal_destino, search_value,idcodigo,idsubgrupo}} = req;
  stockService.search_stock_envio(search_value, idsucursal, idsucursal_destino,idcodigo,idsubgrupo,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const descontar_cantidad_por_codigo = (req,res)=>{
  const {body} = req;
  stockService.descontar_cantidad_por_codigo(body, (response)=>{
    res.status(201).send({status:'OK', data:response});
  })
}

const obtener_lista_stock_filtros = (req,res)=>{
  const {body} = req;
  stockService.obtener_lista_stock_filtros(body, (rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const obtener_stock_ventas = (req,res)=>{
  const {body} = req;
  stockService.obtener_stock_ventas(body, (rows)=>{
    res.status(201).send({status:'OK', data: rows});
  })

}

const obtener_stock_detalles_venta = (req,res)=>{
  const {params:{idsucursal,idcodigo}} = req;
  stockService.obtener_stock_detalles_venta({idsucursal:idsucursal, idcodigo: idcodigo},(rows)=>{
    res.status(201).send({status: 'OK', data: rows});
  })
}

const editarStock = (req, res) => {}

const obtener_subgrupo_full = (req,res) => {
  console.log("lalalala")
  stockService.obtener_subgrupo_full((rows)=>{

    res.status(201).send({status: 'OK', data: rows});
    
  })

}

const modificar_cantidad = (req, res) => {
  const {body} = req
  stockService.modificar_cantidad(body,(resp)=>{
    res.status(201).send({status:'OK', data: resp})
  })
}

const obtener_grilla_stock = (req, res) => {
  const {body} = req
  stockService.obtener_grilla_stock(body,(rows)=>{
    res.status(201).send({status:'OK', data: rows})
  })
}

module.exports = {
  modificar_cantidad,
  obtener_subgrupo_full,
  obtenerListaStock,
  agregarStock,
  editarStock,
  obtener_stock_por_subgrupo,
  obtener_detalle_stock_sucursal,
  search_stock,
  incrementar_cantidad,
  obtener_codigos_sin_stock_sucursal,
  agregar_stock_lote,
  obtener_stock_sucursal,
  stock_codigo_sucursales,
  search_stock_envio,
  descontar_cantidad_por_codigo,
  obtener_lista_stock_filtros,
  obtener_stock_ventas,
  obtener_stock_detalles_venta,
  modificar_cantidad_categoria,
  verificar_cantidades_productos,
  obtener_grilla_stock,
  };