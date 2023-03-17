const SubGrupoDB = require("../database/SubGrupo")

const obtenerSubgrupos = (req, res) => {}

const obtenerSubgrupo = (req, res) => {}

const agregarSubgrupo = (data,callback) => {
  SubGrupoDB.agregar_subgrupo(data,(id)=>{
    return callback(id);
  })
}

const editarSubgrupo = (req, res) => {}


module.exports = {
    obtenerSubgrupos,
    obtenerSubgrupo,
    agregarSubgrupo,
    editarSubgrupo,
  };