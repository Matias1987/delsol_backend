const ventaService = require("../services/VentaService")

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

const editarVenta = (req, res) => {}

module.exports = {
    obtenerVentas,
    obtenerVentasSucursal,
    agregarVenta,
    obtenerVenta,
    editarVenta,
    obtenerVentaMP,
  };