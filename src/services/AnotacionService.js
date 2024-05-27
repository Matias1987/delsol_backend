const AnotacionDB = require("../database/Anotacion")

const agregarAnotacion = (params, callback) => {
 AnotacionDB.agregarAnotacion(params,(resp)=>{
    callback(resp)
 })
}

const obtenerAnotacion = (idanotacion, callback) => {
 AnotacionDB.obtenerAnotacion(idanotacion,(resp)=>{
    callback(resp)
 })
}

const obtenerAnotaciones = (params, callback) => {
 AnotacionDB.obtenerAnotaciones(params,(resp)=>{
    callback(resp)
 })
}

module.exports = {agregarAnotacion,obtenerAnotacion,obtenerAnotaciones}