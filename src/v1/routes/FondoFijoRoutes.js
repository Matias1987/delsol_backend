const express = require("express");
const router = express.Router();
const controller = require("../../controllers/FondoFijoController")

router.get("/", (req,res)=>{controller.obtenerFondoFijos(req, res)});
router.post("/", controller.crearFondoFijo);
router.post("/operaciones", controller.GetOperacionesFF);

module.exports = router;