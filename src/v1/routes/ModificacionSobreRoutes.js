const express = require("express");
const controller = require("../../controllers/ModificacionSobreController");
const router = express.Router();

router.post("/consumo-subgrupo-mes/", (req, res) => {
  controller.obtenerConsumoSubgrupoMes(req, res);
});

module.exports = router;
