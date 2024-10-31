const express = require("express");
const router = express.Router();
const tareaController = require("../../controllers/TareaController")

router.post("/t/add/",(req,res)=>{
    tareaController.agregar_tarea(req,res)
})

router.post("/t/g/",(req, res)=>{
    tareaController.obtener_tareas(req, res)
})

module.exports = router