const express = require("express");
const router = express.Router();
const controller = require("../../controllers/ClienteOpinionController")

router.post("/add/",(req, res)=>{
    controller.agregarOpinion(req,res)
})

router.get("/",(req, res)=>{
    controller.obtenerOpiniones(req,res)
})

module.exports=router;