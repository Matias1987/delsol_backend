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

const obtener_codigos_bysubgrupo_opt = (req,res) =>{
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {params:{subgrupoId}} = req;

  codigoService.obtener_codigos_bysubgrupo_opt(subgrupoId,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })

}


module.exports = {
    obtenerCodigo,
    obtenerCodigos,
    agregarCodigo,
    editarCodigo,
    obtener_codigos_bysubgrupo_opt,
  };