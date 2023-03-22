const SubFamiliaDB = require("../database/SubFamilia")

const obtenerSubFamilias = (req, res) => {}
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


module.exports = {
    obtenerSubFamilias,
    obtenerSubFamilia,
    agregarSubFamilia,
    editarSubFamlia,
    obtener_subfamilias_byfamilia_opt,
  };