const db = require("../database/ObjetivoSucursal")

const obtener_objetivo_sucursal = (data,callback) =>{
 db.obtener_objetivo_sucursal(data,response=>{
    callback(response)
 })
}

const establecer_objetivo_sucursal = (data,callback)=>{
 db.establecer_objetivo_sucursal(data,response=>{
    callback(response)
 })
}

const obtener_progreso_sucursal_objetivo =(data,callback) => {
 db.obtener_progreso_sucursal_objetivo(data,response=>{
    callback(response)
 })
}


module.exports = {
    obtener_objetivo_sucursal,
    obtener_progreso_sucursal_objetivo,
    establecer_objetivo_sucursal,
}