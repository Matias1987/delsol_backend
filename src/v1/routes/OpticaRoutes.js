const opticaController = require("../../controllers/OpticaController")
const express = require("express");
const router = express.Router();

router.get("/",(req, res)=>{
    opticaController.obtener_opticas(req, res)
})

router.get("/:idoptica",(req, res)=>{
    opticaController.obtener_optica(req, res)
})

router.get("/obtener/saldo/cliente/optica/:idcliente/:idoptica",(req, res)=>{
    opticaController.obtener_saldo_cliente_optica(req,res)
})

router.post("/",(req, res)=>{
    opticaController.agregar_optica(req, res)
})

router.post("/mod/",(req, res)=>
{
    opticaController.modificar_optica(req, res)
})

module.exports = router