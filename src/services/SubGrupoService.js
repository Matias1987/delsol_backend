const SubGrupoDB = require("../database/SubGrupo")

const obtener_subgrupos_grupo = (idsubfamilia,callback)=>{
  SubGrupoDB.obtener_subgrupos_grupo(idsubfamilia,(rows)=>{
    return callback(rows)
  })
}

const obtener_subgrupos_bygrupo_opt = (grupoid,callback) => {
  SubGrupoDB.obtener_subgrupos_bygrupo_opt(grupoid,(rows)=>{
    return callback(rows);
  })
}

const obtenerSubgrupos = (idg, callback) => {
  SubGrupoDB.obtener_subgrupos(idg, (rows)=>{
    return callback(rows)
  })
}

const obtenerSubgrupo = (req, res) => {}

const agregarSubgrupo = (data,callback) => {
  SubGrupoDB.agregar_subgrupo(data,(id)=>{
    return callback(id);
  })
}

const editarSubgrupo = (data, callback) => {
  SubGrupoDB.editarSubgrupo(data,(resp)=>{
    return callback(resp)
  })
}

const modificar_multiplicador = (categoria, id, value, incrementar, callback) => {
  console.log("modificar mult. SERVICE")

  SubGrupoDB.modificar_multiplicador_grupos(categoria, id, value, incrementar, (data)=>{
    callback(data)
  })
}

const obtener_detalle_subgrupo = (id,callback) => {
  SubGrupoDB.obtener_detalle_subgrupo(id,(rows)=>{
    callback(rows)
  })
}

const modificar_precios_defecto = (data,callback) => {
  SubGrupoDB.modificar_precios_defecto(data,(rows)=>{
    callback(rows)
  })
}

const obtener_descripcion_cat_subgrupo = (id,callback) => {
  SubGrupoDB.obtener_descripcion_cat_subgrupo(id,(rows)=>{
    callback(rows)
  })
}


module.exports = {
    obtenerSubgrupos,
    obtenerSubgrupo,
    agregarSubgrupo,
    editarSubgrupo,
    obtener_subgrupos_bygrupo_opt,
    modificar_multiplicador,
    obtener_detalle_subgrupo,
    modificar_precios_defecto,
    obtener_descripcion_cat_subgrupo,
    obtener_subgrupos_grupo,
  };