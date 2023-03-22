const subfamiliaService = require("../services/SubFamiliaService")
const obtenerSubFamilias = (req, res) => {}

const obtenerSubFamilia = (req, res) => {}

const agregarSubFamilia = (req, res) => {
  const {body} = req;
  const nueva_sub_familia = {
    'nombre_corto': body.nombre_corto,
    'nombre_largo': body.nombre_largo,
    'familia_idfamilia': body.familia_idfamilia
  }
  subfamiliaService.agregarSubFamilia(nueva_sub_familia,(id)=>{
    res.status(201).send({status:'OK', data:id});
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

module.exports = {
    obtenerSubFamilias,
    obtenerSubFamilia,
    agregarSubFamilia,
    editarSubFamlia,
    obtener_subfamilias_byfamilia_opt,
  };