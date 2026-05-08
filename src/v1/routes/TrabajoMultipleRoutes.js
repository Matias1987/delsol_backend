const express = require("express");
const router = express.Router();
const controller = require("../../controllers/TrabajoMultipleController");

router.post("/", (req, res) => {
    controller.procesarTrabajoMultiple(req, res);
});

router.get("/",(req,res) => {
    controller.obtenerListadoVentasTM(req,res);
})

router.get("/:idventa",(req,res) => {
    controller.obtenerTrabajoMultiple(req,res);
});

module.exports = router;