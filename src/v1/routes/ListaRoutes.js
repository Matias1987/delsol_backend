const express = require("express");
const router = express.Router();
const controller = require("../../controllers/ListaController")

router.post("/medico/",(req,res)=>{controller.AgregarMedicoALista(req,res)});

router.post("/nombres/",(req,res)=>{controller.ObtenerNombreListasPorTipo(req,res)});

module.exports = router;