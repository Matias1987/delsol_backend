const express = require("express");
const router = express.Router();
const tagController = require("../../controllers/TagController")

router.post("/",(req,res)=>{
    tagController.agregar_tag(req,res)
})

router.post("/categoria/",(req,res)=>{
    tagController.agregar_categoria(req,res)
})
router.post("/tag/codigo/",(req,res)=>{
    tagController.agregar_tag_codigo(req,res)
})

router.post("/lista/",(req,res)=>{
    tagController.obtener_lista_tag(req, res)
})

router.post("/lista/tag/codigo/",(req,res)=>{
    tagController.obtener_lista_tag_codigo(req, res)
})

router.get("/categoria/lista/",(req,res)=>{
    tagController.obtener_lista_categorias(req,res)
})

router.post("/rem/tag/cod/",(req,res)=>{
    tagController.eliminar_etiquetas(req,res)
})


module.exports = router
