const tareaService = require("../services/TareaService")

const agregar_tarea = (req, res) =>{
    const {body} = req
    tareaService.agregar_tarea(body,(resp)=>{
        res.status(201).send({status:'OK',data:resp});
    })
}

const obtener_tareas = (req, res) =>{
    const {body} = req
    tareaService.obtener_tareas(body,(resp)=>{
        res.status(201).send({status:'OK',data:resp});
    })
}

module.exports={agregar_tarea, obtener_tareas}