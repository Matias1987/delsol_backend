const controller = require("../../controllers/InformesCajaController")
const express = require("express");
const router = express.Router();

router.post("/ls/total/cc/m/",(req,res)=>{
    controller.listaTotalCobrosCuotaMes(req,res)
})
router.post("/ls/total/g/m/",(req,res)=>{
    controller.listaTotalGastosMes(req,res)
})

module.exports = router