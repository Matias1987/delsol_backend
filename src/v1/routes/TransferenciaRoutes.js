const express = require("express");
const router = express.Router();
const transferencia = require("../../controllers/TransferenciaController")

router.post("/",(req,res)=>{
    transferencia.agregar_transferencia(req,res)
})

router.get("/enviadas/:idsucursal/:idcaja",(req,res)=>{
    transferencia.obtener_transferencias_enviadas(req,res)
})


router.get("/recibidas/:idsucursal/:idcaja",(req,res)=>{
    transferencia.obtener_transferencias_recibidas(req,res)
})


module.exports = router;