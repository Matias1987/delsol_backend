const express = require("express");
const router = express.Router();
const bajaDesperfecto = require("../../controllers/BajaDesperfectoController")

router.post("/",(req,res)=>{
    bajaDesperfecto.agregarBajaDesperfecto(req,res)
})

router.get("/",(req,res)=>{
    bajaDesperfecto.obtener_lista(req,res)
})


module.exports = router;