const SubFamiliaDB = require("../database/SubFamilia")

const obtenerSubFamilias = (callback) => {
  SubFamiliaDB.obtener_subfamilias(
    (rows)=>{
      return callback(rows);
    }
    )
}
const obtenerSubFamilia = (data,callback) => {
  
}
const agregarSubFamilia = (data, callback) => {SubFamiliaDB.agregar_subfamilia(data, (id)=>{return callback(id)})}
const editarSubFamlia = (req, res) => {}

const obtener_subfamilias_byfamilia_opt = (idfamilia, callback) =>{
  SubFamiliaDB.obtener_subfamilias_byfamilia_opt(idfamilia,
    (rows)=>{
      return callback(rows);
    }
    )
}

const obtener_subfamilias_de_familias = (data, callback) => {
  SubFamiliaDB.obtener_subfamilias_de_familias(data,(rows)=>{
    return callback(rows)
  })
}


module.exports = {
    obtener_subfamilias_de_familias,
    obtenerSubFamilias,
    obtenerSubFamilia,
    agregarSubFamilia,
    editarSubFamlia,
    obtener_subfamilias_byfamilia_opt,
  };