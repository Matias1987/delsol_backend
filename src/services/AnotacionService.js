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

const obtenerAnotaciones = (callback) => {
 AnotacionDB.obtenerAnotaciones((resp)=>{
    callback(resp)
 })
}

module.exports = {agregarAnotacion,obtenerAnotacion,obtenerAnotaciones}