const GrupoDB = require("../database/Grupo")

const obtenerGrupo = (req, res) => {}
const obtenerGrupos = (req, res) => {}
const agregarGrupo = (data,callback) => {
  GrupoDB.agregar_grupo(data,(id)=>{
    return callback(id);
  })
}
const editarGrupo = (req, res) => {}

const obtener_grupos_bysubfamilia_opt = (idsubfamilia,callback) =>{
  GrupoDB.obtener_grupos_bysubfamilia_opt(idsubfamilia,(rows)=>{
    return callback(rows);
  })
}

module.exports = {
    obtenerGrupo,
    obtenerGrupos,
    agregarGrupo,
    editarGrupo,
    obtener_grupos_bysubfamilia_opt,
  };