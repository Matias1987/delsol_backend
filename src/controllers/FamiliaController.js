const familiaService = require("../services/FamiliaService")

const obtenerFamilias = (req, res) => {}

const obtenerFamilia = (req, res) => {}

const agregarFamilia = (req, res) => {
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


module.exports = {
    obtenerFamilias,
    obtenerFamilia,
    agregarFamilia,
    editarFamilia,
  };