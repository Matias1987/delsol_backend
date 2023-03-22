const subgrupoService = require("../services/SubGrupoService")

const obtenerSubgrupos = (req, res) => {}

const obtenerSubgrupo = (req, res) => {


}

const obtener_subgrupos_bygrupo_opt = (req,res)=>{
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {params: {grupoId}} = req;

  subgrupoService.obtener_subgrupos_bygrupo_opt(grupoId,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })

}

const agregarSubgrupo = (req, res) => {

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

const editarSubgrupo = (req, res) => {}


module.exports = {
    obtenerSubgrupos,
    obtenerSubgrupo,
    agregarSubgrupo,
    editarSubgrupo,
    obtener_subgrupos_bygrupo_opt,
  };