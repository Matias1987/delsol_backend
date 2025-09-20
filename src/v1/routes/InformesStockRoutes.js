const express = require("express");
const controller = require("../../controllers/InformeStockController");
const router = express.Router();

router.post("/inf/t/st",(req, res)=>{
    controller.totalesStock(req,res)
})


module.exports=router
