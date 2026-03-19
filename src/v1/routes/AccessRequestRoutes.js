const express = require("express");
const router = express.Router();
const controller = require("../../controllers/AccessRequestController");

router.post("/", (req,res) => {
    controller.generate_new_request(req, res);
})

router.post("/v/", (req,res) => {
    controller.validate_request(req, res);
})


router.post("/chs/", (req,res) => {
    controller.check_request_status(req, res);
})

module.exports = router;