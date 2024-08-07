const subfamiliaService = require("../services/SubFamiliaService")
const obtenerSubFamilias = (req, res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  subfamiliaService.obtenerSubFamilias((rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const obtenerSubFamilia = (req, res) => {}

const agregarSubFamilia = (req, res) => {
   //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  const {body} = req;
  const nueva_sub_familia = {
    'nombre_corto': body.nombre_corto,
    'nombre_largo': body.nombre_largo,
    'familia_idfamilia': body.familia_idfamilia
  }
  
  subfamiliaService.agregarSubFamilia(nueva_sub_familia,(id)=>{
    if(id<0){
      res.status(201).send({status:'ERROR', data:"La subfamilia ya existe"});
    }
    else
    {
      res.status(201).send({status:'OK', data:id});
    }
    
  })
}

const obtener_subfamilias_byfamilia_opt = (req,res)=>{
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {params:{familiaId}} = req;

  subfamiliaService.obtener_subfamilias_byfamilia_opt(
    familiaId,
    (rows)=>{
      res.status(201).send({status:'OK', data:rows});
    }

  )


}

const editarSubFamlia = (req, res) => {}

const obtener_subfamilias_de_familias = (req, res) => {
  const {body} = req

  subfamiliaService.obtener_subfamilias_de_familias(body,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })

}

module.exports = {
    obtenerSubFamilias,
    obtenerSubFamilia,
    agregarSubFamilia,
    editarSubFamlia,
    obtener_subfamilias_byfamilia_opt,
    obtener_subfamilias_de_familias,
  };