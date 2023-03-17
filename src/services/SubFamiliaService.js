const SubFamiliaDB = require("../database/SubFamilia")

const obtenerSubFamilias = (req, res) => {}
const obtenerSubFamilia = (data,callback) => {
  
}
const agregarSubFamilia = (data, callback) => {SubFamiliaDB.agregar_subfamilia(data, (id)=>{return callback(id)})}
const editarSubFamlia = (req, res) => {}

module.exports = {
    obtenerSubFamilias,
    obtenerSubFamilia,
    agregarSubFamilia,
    editarSubFamlia,
  };