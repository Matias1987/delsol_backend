const GrupoDB = require("../database/Grupo")

const obtenerGrupo = (req, res) => {}
const obtenerGrupos = (callback) => {
  GrupoDB.obtener_grupos((rows)=>{
    return callback(rows);
  })
}
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