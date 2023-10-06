const LocalidadDB = require("../database/Localidad");

const obtenerLocalidadesPorProvincia = (idProvincia, callback) => 
{
   LocalidadDB.obtenerLocalidadesPorProvincia(idProvincia,(rows)=>{
    return callback(rows)
   })
}

const obtenerProvincias = (callback) =>{
    LocalidadDB.obtenerProvincias((rows)=>{
        return callback(rows)
    })
}

module.exports = {obtenerLocalidadesPorProvincia, obtenerProvincias}