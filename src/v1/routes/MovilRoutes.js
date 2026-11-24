const express = require("express");
const controller = require("../../controllers/MovilController");
const router = express.Router();

router.post("/operaciones/", (req, res) => {
  controller.insert(req, res);
});

module.exports = router;
