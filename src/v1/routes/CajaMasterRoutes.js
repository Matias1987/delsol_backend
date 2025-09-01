const express = require("express");
const router = express.Router();
const controller = require("../../controllers/CajaMasterController")

router.get("/", controller.getBalance);
router.get("/cajas", controller.getCajasSucursales);
router.post("/transferencia/a/master", controller.generarTransferenciaACajaMaster);

module.exports = router;