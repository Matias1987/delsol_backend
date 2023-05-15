const subgrupoService = require("../services/SubGrupoService")

const obtenerSubgrupos = (req, res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  subgrupoService.obtenerSubgrupos((rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

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
//FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {body} = req;
  const nuevo_subgrupo = {
    'nombre_corto' : body.nombre_corto,
    'nombre_largo' : body.nombre_largo,
    'grupo_idgrupo' : body.grupo_idgrupo,
    'multiplicador': body.multiplicador,
  }

  subgrupoService.agregarSubgrupo(nuevo_subgrupo,(id)=>{
    if(id<0){
      res.status(201).send({status:'ERROR', data:"El subgrupo ya existe"});
    }
    else{
      res.status(201).send({status:'OK', data:id});
    }

  })

}

const modificar_multiplicador = (req, res) => {
  
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {body} = req;
  console.log("modificar mult. CONTROLLER")
  console.log(JSON.stringify(body))

  subgrupoService.modificar_multiplicador(body.categoria, body.id, body.value, (data)=>{
    res.status(201).send({status:'OK', data:data});
  })


}

const editarSubgrupo = (req, res) => {}


module.exports = {
    obtenerSubgrupos,
    obtenerSubgrupo,
    agregarSubgrupo,
    editarSubgrupo,
    obtener_subgrupos_bygrupo_opt,
    modificar_multiplicador,
  };