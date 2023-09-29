const express = require("express");

const pagareController = require("../../controllers/PagareController");

const router = express.Router();

router.get("/obtenerPagare/",(req,res)=>{
    pagareController.obtenerPagare(req,res)
})

router.get("/obtenerPagaresCliente/",(req,res)=>{
    pagareController.obtenerPagaresCliente(req,res)
})

router.post("/", (req, res) => {
    pagareController.agregarPagare(req,res)
  });
  



module.exports = router;