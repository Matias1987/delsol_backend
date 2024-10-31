const tareaDB = require("../database/Tarea")

const agregar_tarea = (data, callback) =>{
    tareaDB.agregar_tarea(data,(resp)=>{
        callback(resp)
    })
}

const obtener_tareas = (data, callback) =>{
    tareaDB.obtener_tareas(data,(resp)=>{
        callback(resp)
    })
}

module.exports={agregar_tarea, obtener_tareas}