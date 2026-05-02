const express = require("express");
const router = express.Router();
const controller = require("../../controllers/TrabajoMultipleController");

router.post("/", (req, res) => {
    controller.procesarTrabajoMultiple(req, res);
});

module.exports = router;