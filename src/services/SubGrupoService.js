const SubGrupoDB = require("../database/SubGrupo")

const obtener_subgrupos_bygrupo_opt = (grupoid,callback) => {
  SubGrupoDB.obtener_subgrupos_bygrupo_opt(grupoid,(rows)=>{
    return callback(rows);
  })
}

const obtenerSubgrupos = (callback) => {
  SubGrupoDB.obtener_subgrupos((rows)=>{
    return callback(rows)
  })
}

const obtenerSubgrupo = (req, res) => {}

const agregarSubgrupo = (data,callback) => {
  SubGrupoDB.agregar_subgrupo(data,(id)=>{
    return callback(id);
  })
}

const editarSubgrupo = (req, res) => {}

const modificar_multiplicador = (categoria, id, value, callback) => {
  console.log("modificar mult. SERVICE")

  SubGrupoDB.modificar_multiplicador_grupos(categoria, id, value, (data)=>{
    callback(data)
  })
}


module.exports = {
    obtenerSubgrupos,
    obtenerSubgrupo,
    agregarSubgrupo,
    editarSubgrupo,
    obtener_subgrupos_bygrupo_opt,
    modificar_multiplicador,
  };