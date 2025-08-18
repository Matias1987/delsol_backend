const express = require("express");
const router = express.Router();
const controller = require("../../controllers/CajaMasterController")

router.get("/:idsucursal/balance", controller.getBalance);
router.get("/cajas", controller.getCajasSucursales);

module.exports = router;