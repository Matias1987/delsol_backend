const express = require("express");
const router = express.Router();
const stockController = require("../../controllers/StockController")

router.post("/quick_add/",(req, res)=>{
    stockController.add_stock_quick(req, res);
});

router.post("/dist/stock/",(req,res)=>{
    stockController.distribuir_cantidad_a_sucursales(req,res);
})

module.exports = router;