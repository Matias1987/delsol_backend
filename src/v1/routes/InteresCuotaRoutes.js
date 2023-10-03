const express = require("express");
const ICController = require("../../controllers/InteresCuotaController");
const router = express.Router();

router.get("/", (req, res) => {
    ICController.obtenerInteresCuotas(req,res)
  });

  module.exports = router;