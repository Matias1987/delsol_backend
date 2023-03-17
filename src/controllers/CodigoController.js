const codigoService = require("../services/CodigoService")

const obtenerCodigo = (req, res) => {}

const obtenerCodigos = (req, res) => {}

const agregarCodigo = (req, res) => {
  const {body} = req;
  const nuevo_codigo = {
    'codigo': body.codigo,
    'descripcion': body.descripcion,
    'subgrupo_idsubgrupo': body.subgrupo_idsubgrupo
  }
  codigoService.agregarCodigo(nuevo_codigo,
    (id)=>{
      res.status(201).send({status:'OK', data:id})
    })
}

const editarCodigo = (req, res) => {}


module.exports = {
    obtenerCodigo,
    obtenerCodigos,
    agregarCodigo,
    editarCodigo,
  };