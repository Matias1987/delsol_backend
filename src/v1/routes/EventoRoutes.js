const express = require("express");

const eventoController = require("../../controllers/EventoController");

const router = express.Router();

router.post("/get/", (req, res) => {
  eventoController.get_events(req,res);
});
router.post("/", (req, res) => {
  eventoController.register_event(req,res);
});
 module.exports = router