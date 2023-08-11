const ventaService = require("../services/VentaService")

const cambiar_estado_venta = (req,res) => {
  const {body} = req;
  ventaService.cambiar_estado_venta(body,(result)=>{
    res.status(201).send({status:'OK', data:result})
  })
}

const agregarVenta = (req, res) => {
  const {body} = req;
  ventaService.agregarVenta(body,(resp)=>{
    res.status(201).send({status:'OK', data:resp})
  })
  /*const nueva_venta = {
    'cliente_idcliente' : body.cliente_idcliente,
    'sucursal_idsucursal' : body.sucursal_idsucursal,
    'vendedor_idvendedor' : body.vendedor_idvendedor,
    'caja_idcaja' : body.caja_idcaja,
    'usuario_idusuario' : body.usuario_idusuario,
    'medico_idmedico' : body.medico_idmedico,
    'monto_total' : body.monto_total,
    'descuento' : body.descuento,
    'monto_inicial' : body.monto_inicial,
    'debe' : body.debe,
    'haber' : body.haber,
    'saldo' : body.saldo,
    'fecha' : body.fecha,
    'fecha_alta' : body.fecha_alta,
  }

  ventaService.agregarVenta(nueva_venta,(id)=>{
    res.status(201).send({status:'OK', data:id})
  })*/

}

const obtenerVentas = (req, res) => {
  ventaService.obtenerVentas((rows)=>{
    res.status(201).send({status:'OK', data:rows})
  })
}
const obtenerVentasSucursal = (req, res) => {
  const {body} = req;
  const id = body.id;
  ventaService.obtenerVentasSucursal(id,(rows)=>{
    res.status(201).send({status:'OK', data:rows})
  })
}

const obtenerVenta = (req, res) => {
  const {params:{ventaId}} = req;
  ventaService.obtenerVenta(ventaId,(row)=>{
    res.status(201).send({status:'OK', data:row})
  })
}

const obtenerVentaMP = (req, res) => {
  const {params:{ventaId}} = req;
  ventaService.obtenerVentaMP(ventaId,(row)=>{
    res.status(201).send({status:'OK', data:row})
  })
}
const obtenerVentaMPCtaCte = (req, res) => {
  const {params:{ventaId}} = req;
  ventaService.obtenerVentaMPCtaCte(ventaId,(row)=>{
    res.status(201).send({status:'OK', data:row})
  })
}

const lista_venta_sucursal_estado = (req, res) => {
  const {body} = req;
  ventaService.lista_venta_sucursal_estado(body,(rows)=>{
    res.status(201).send({status:'OK', data:rows})
  })
}

const lista_venta_item = (req,res) => {
  const {params:{ventaId}} = req
  ventaService.lista_venta_item(ventaId,(rows)=>{
    res.status(201).send({status:'OK', data:rows})
  })
}

const editarVenta = (req, res) => {}

const cambiar_venta_sucursal_deposito = (req,res)=>{
  const {body} = req;
  ventaService.cambiar_venta_sucursal_deposito(body.en_laboratorio, body.idventa, (resp)=>{
    res.status(201).send({status:'OK', data:resp})
  } )
}

module.exports = {
    obtenerVentas,
    obtenerVentasSucursal,
    agregarVenta,
    obtenerVenta,
    editarVenta,
    obtenerVentaMP,
    lista_venta_sucursal_estado,
    lista_venta_item,
    cambiar_estado_venta,
    obtenerVentaMPCtaCte,
    cambiar_venta_sucursal_deposito,
  };