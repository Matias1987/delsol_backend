const express = require("express");
const router = express.Router();
const ItemsAdicionalesController = require("../../controllers/ItemsAdicionalesController")

router.get("/:idventa", (req, res) => {
    ItemsAdicionalesController.obtener_adicionales_venta(req,res)
  });

  router.post("/",(req,res)=>{
    ItemsAdicionalesController.agregar_item_adicional(req,res)
  })
  
  router.post("/obtener/uso/items/adic/subgrupo/periodo/",(req,res)=>{
    ItemsAdicionalesController.obtener_uso_items_adic_subgrupo_periodo(req,res)
  })

  module.exports = router; 