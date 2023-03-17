const grupoService = require("../services/GrupoService")

const obtenerGrupo = (req, res) => {}

const obtenerGrupos = (req, res) => {}

const agregarGrupo = (req, res) => {
  const {body} = req;
  const nuevo_grupo = {
    'nombre_corto': body.nombre_corto,
    'nombre_largo': body.nombre_largo,
    'subfamilia_idsubfamilia': body.subfamilia_idsubfamilia
  }
  grupoService.agregarGrupo(nuevo_grupo,(id)=>{
    res.status(201).send({status:'OK', data:id});
  })
}

const editarGrupo = (req, res) => {}


module.exports = {
    obtenerGrupo,
    obtenerGrupos,
    agregarGrupo,
    editarGrupo,
  };