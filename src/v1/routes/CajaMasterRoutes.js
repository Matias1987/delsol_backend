const express = require("express");
const router = express.Router();
const controller = require("../../controllers/CajaMasterController")

router.get("/blc/:fullList", controller.getBalance);
router.get("/cajas/p/s", controller.getCajasSucursales);
router.post("/transferencia/a/master", controller.generarTransferenciaACajaMaster);
router.post("/transferencia/a/ff", controller.generarTransferenciaAFF);
router.post("/agregar_egreso", controller.agregarEgreso);

module.exports = router;