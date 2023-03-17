const grupoService = require("../services/GrupoService")

const obtenerSubgrupos = (req, res) => {}

const obtenerSubgrupo = (req, res) => {
  const {body} = req;
  const nuevo_subgrupo = {
    'nombre_corto' : body.nombre_corto,
    'nombre_largo' : body.nombre_largo,
    'grupo_idgrupo' : body.grupo_idgrupo
  }

  grupoService.agregarGrupo(nuevo_subgrupo,(id)=>{
    res.status(201).send({status:'OK', data:id});
  })

}

const agregarSubgrupo = (req, res) => {}

const editarSubgrupo = (req, res) => {}


module.exports = {
    obtenerSubgrupos,
    obtenerSubgrupo,
    agregarSubgrupo,
    editarSubgrupo,
  };