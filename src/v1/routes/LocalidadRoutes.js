const express = require("express");
const router = express.Router();
const localidadController = require("../../controllers/LocalidadController")

router.get("/obtener_localidades_provincia/:idprovincia",(req,res)=>{
    localidadController.obtenerLocalidadesPorProvincia(req,res)
})

router.get("/obtener_provincias/",(req,res)=>{
    localidadController.obtenerProvincias(req,res)
})



module.exports = router;