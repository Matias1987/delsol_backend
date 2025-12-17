const express = require("express");
const router = express.Router();
const stockController = require("../../controllers/StockController")

router.post("/quick_add/",(req, res)=>{
    stockController.add_stock_quick(req, res);
});

module.exports = router;