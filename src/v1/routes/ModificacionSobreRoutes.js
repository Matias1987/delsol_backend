const express = require("express");
const controller = require("../../controllers/ModificacionSobreService");
const router = express.Router();

router.get("/consumo-subgrupo-mes", controller.obtenerConsumoSubgrupoMes);

module.exports = router;