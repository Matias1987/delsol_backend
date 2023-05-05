const familiaService = require("../services/FamiliaService")

const obtenerFamilias = (req, res) => {
  //console.log(JSON.stringify(req))
  familiaService.obtenerFamilias((rows)=>{
    res.status(201).send({status:'OK',data:rows});
  })
}

const obtenerFamilia = (req, res) => {}

const agregarFamilia = (req, res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {body} = req;
  const familia_nueva = {
    nombre_corto: body.nombre_corto,
    nombre_largo: body.nombre_largo
  }
  familiaService.agregarFamilia(familia_nueva,()=>{
    res.status(201).send({status:'OK', data:"familia agregada..."});
  })
}

const editarFamilia = (req, res) => {}

const obtener_familias_opt = (req,res)=>{
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //console.log(req)
  console.log(req.cookies)
  familiaService.obtener_familias_opt((rows)=>{
    res.status(201).send({status:'OK',data:rows});
  })
}


module.exports = {
    obtenerFamilias,
    obtenerFamilia,
    agregarFamilia,
    editarFamilia,
    obtener_familias_opt,
  };