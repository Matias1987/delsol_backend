const express = require("express");

const controller = require("../../controllers/SorteoController");

const router = express.Router();

router.post("/gen/",(req,res)=>{controller.generarSorteo(req,res)})
router.post("/get/p/dis/",(req,res)=>{controller.obtenerParticipantesDistinct(req,res)})
router.post("/get/tck/",(req,res)=>{controller.obtenerTickets(req,res)})
router.post("/set/wn/",(req,res)=>{controller.determinarGanador(req,res)})
router.post("/srt/",(req,res)=>{controller.obtenerSorteo(req,res)})

module.exports = router