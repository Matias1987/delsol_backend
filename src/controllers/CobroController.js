const cobroService = require("../services/CobroService")

const obtenerCobros = (req, res) => {
  const {body} = req;
  cobroService.obtenerCobros(body,(rows)=>{
    res.status(201).send({status:'OK' , data: rows});
  })
}

const agregarCobro = (req, res) => {
  const {body} = req;
  /*const nuevo_cobro = {
    'caja_idcaja' : body.caja_idcaja,
    'usuario_idusuario' : body.usuario_idusuario,
    'cliente_idcliente' : body.cliente_idcliente,
    'venta_idventa' : body.venta_idventa,
    'monto' : body.monto,
    'tipo' : body.tipo,
  };*/

  cobroService.agregarCobro(body,(id)=>{
    res.status(201).send({status:'OK' , data: id});
  })

}

const obtenerCobro = (req, res) => {
  const {params:{cobroId}} = req;
  cobroService.obtenerCobro(cobroId,(row)=>{
    res.status(201).send({status:'OK' , data: row});
  })

}

const editarCobro = (req, res) => {}


module.exports = {
    obtenerCobros,
    agregarCobro,
    obtenerCobro,
    editarCobro,
  };