const express = require("express");
const router = express.Router();
const controller = require("../../controllers/SettingsController")

router.post("/ls/",(req,res)=>{
    controller.getSettings(req,res)
})
router.post("/",(req,res)=>{
    controller.addUpdateSetting(req,res)
})



module.exports = router