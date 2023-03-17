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

const editarSubFamlia = (req, res) => {}

module.exports = {
    obtenerSubFamilias,
    obtenerSubFamilia,
    agregarSubFamilia,
    editarSubFamlia,
  };