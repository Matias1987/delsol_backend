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

const obtenerLocalidad = (data, callback) => {
    LocalidadDB.obtenerLocalidad(data,(response)=>{
        return callback(response)
    })
}

module.exports = {obtenerLocalidadesPorProvincia, obtenerProvincias, obtenerLocalidad}