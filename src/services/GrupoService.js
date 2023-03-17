const GrupoDB = require("../database/Grupo")

const obtenerGrupo = (req, res) => {}
const obtenerGrupos = (req, res) => {}
const agregarGrupo = (data,callback) => {
  GrupoDB.agregar_grupo(data,(id)=>{
    return callback(id);
  })
}
const editarGrupo = (req, res) => {}

module.exports = {
    obtenerGrupo,
    obtenerGrupos,
    agregarGrupo,
    editarGrupo,
  };