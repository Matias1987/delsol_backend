const grupoService = require("../services/GrupoService")

const obtenerGrupo = (req, res) => {}

const obtenerGrupos = (req, res) => {
   //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

   grupoService.obtenerGrupos((rows)=>{
    res.status(201).send({status:'OK', data:rows});
   })
}

const agregarGrupo = (req, res) => {
    //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  const {body} = req;
  const nuevo_grupo = {
    'nombre_corto': body.nombre_corto,
    'nombre_largo': body.nombre_largo,
    'subfamilia_idsubfamilia': body.subfamilia_idsubfamilia
  }
  grupoService.agregarGrupo(nuevo_grupo,(id)=>{
    if(id<0){
      res.status(201).send({status:'ERROR', data:"El grupo ya existe"});
    }
    else{
      res.status(201).send({status:'OK', data:id});
    }
    
  })
}

const editarGrupo = (req, res) => {}

const obtener_grupos_bysubfamilia_opt = (req,res)=>{
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {params:{subfamiliaId}} = req;
  grupoService.obtener_grupos_bysubfamilia_opt(
    subfamiliaId,
    (rows)=>{
      res.status(201).send({status:'OK', data:rows});
    }
  )
}

const mover = (req, res) => {
  const {body} = req
  grupoService.mover(body,(resp)=>{
    res.status(201).send({status:'OK', data:resp});
  })
}

module.exports = {
  mover,
  obtenerGrupo,
  obtenerGrupos,
  agregarGrupo,
  editarGrupo,
  obtener_grupos_bysubfamilia_opt,
  };