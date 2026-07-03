const express = require("express");
const router = express.Router();
const controller = require("../../controllers/TrabajoMultipleController");

router.post("/", (req, res) => {
    controller.procesarTrabajoMultiple(req, res);
});
router.post("/marcar_entregado/", (req, res) => {
    controller.marcarComoEntregado(req, res);
});

router.get("/ls/s/:idsucursal/:tipo_lista",(req,res) => {
    controller.obtenerListadoVentasTM(req,res);
})

router.get("/:idventa",(req,res) => {
    controller.obtenerTrabajoMultiple(req,res);
});

router.get("/items/:idtrabajo",(req,res) => {
    controller.obtenerItemsTrabajo(req,res);
});

router.post("/anular",(req,res) => {
    console.log("anular trabajo multiple");
    controller.anularTrabajoMultiple(req,res);
});

module.exports = router;