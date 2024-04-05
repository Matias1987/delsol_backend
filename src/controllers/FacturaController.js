const facturaService = require("../services/FacturaService")

const obtener_facturas = (req,res) => {
   
    const {params:{idproveedor}} = req
    let _idprov = typeof idproveedor === 'undefined' ? -1 : idproveedor
    _idprov = _idprov == null ? -1 : _idprov
    facturaService.obtener_facturas(_idprov , (rows)=>{
        res.status(201).send({status:'OK', data:rows})
    })
}

const agregar_factura = (req,res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    const {body} = req
    const data = {
        numero: body.numero,
        proveedor_idproveedor: body.proveedor_idproveedor,
        monto: body.monto,
        cantidad: body.cantidad
    }
    facturaService.agregar_factura(data,(id)=>{
        res.status(201).send({status:'OK', data:id})
    })

}

const detalle_factura = (req,res)=>{
    const {params:{idfactura}} = req;
    facturaService.detalle_factura(idfactura,(rows)=>{
        res.status(201).send({status:'OK', data:rows})
    })
}

const lista_elementos_factura = (req,res)=>{
    const {params:{idfactura}} = req;
    facturaService.lista_elementos_factura(idfactura,(rows)=>{
        res.status(201).send({status:'OK', data:rows})
    })
}

module.exports = {
    obtener_facturas,agregar_factura,detalle_factura,lista_elementos_factura,
}