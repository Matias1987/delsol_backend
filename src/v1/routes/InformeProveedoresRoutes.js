const express = require("express");
const controller = require("../../controllers/InformeProveedoresController");
const router = express.Router();

router.post("/info/l/sdo/", (req, res) => {
  controller.saldo_proveedores_lista(req, res);
});

router.get("/info/l/sdo/general", (req, res) => {
  controller.obtener_saldo_general(req, res);
});

module.exports = router;
