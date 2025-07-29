const express = require("express");
const controller = require("../../controllers/ImporterController");
const router = express.Router();

router.post("/",(req,res)=>{
    console.log("ROUTER")
    controller.procesar_data(req,res)
})

module.exports = router;