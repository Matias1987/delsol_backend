const familiaDB = require("../database/Familia");

const obtenerFamilias = (callback) => {

  familiaDB.obtener_familias((rows)=>{
    return callback(rows);
  })

}

const obtenerFamilia = (req, res) => {}

const agregarFamilia = (data, callback) => {
  familiaDB.agregar_familia(data,(id)=>{
    return callback(id);
  })
}

const editarFamilia = (req, res) => {}

const obtener_familias_opt = (callback) =>{
  familiaDB.obtener_familias_opt((rows)=>{
    return callback(rows);
  })
}


module.exports = {
    obtenerFamilias,
    obtenerFamilia,
    agregarFamilia,
    editarFamilia,
    obtener_familias_opt,
  };