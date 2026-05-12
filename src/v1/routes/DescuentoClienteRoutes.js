const express = require("express");
const router = express.Router();
const controller = require("../../controllers/DescuentoClienteController");

router.post("/obtener/", (req, res) => {
    controller.obtenerDescuentoClienteSubgrupo(req, res);
});

router.post("/", (req, res) => {
    controller.agregarDescuentoClienteSubgrupo(req, res);
});
router.post("/cambiar/estado/", (req, res) => {
    controller.cambiarEstadoDescuento(req, res);
});

router.get("/",(req,res)=>{
    controller.obtenerListado(req,res);
});

module.exports = router;