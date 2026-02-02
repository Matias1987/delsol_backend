const express = require("express");
const router = express.Router();
const controller = require("../../controllers/StockCristalesController")

router.post("/insert/grid/",(req,res)=>{
    controller.guardar_stock_cristales(req,res);
});

router.post("/get/grid/",(req,res)=>{
    controller.obtener_grilla(req,res);
});

router.post("/get/stock/",(req,res)=>{
    controller.obtener_stock(req,res);
});


router.get("/get/codigos/",(req,res)=>{
    controller.obtener_codigos_cristales(req,res);
})

module.exports = router;