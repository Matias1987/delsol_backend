const express = require("express");
const router = express.Router();
const stockController = require("../../controllers/StockController")

router.get("/", (req, res) => {
  stockController.obtenerListaStock(req,res)
});

router.get("/:stockId", (req, res) => {
  res.send("Get an existing workout");
});

router.get("/porsubgrupo/:idsubgrupo", (req, res) => {
  stockController.obtener_stock_por_subgrupo(req,res)
});

router.get("/detalle/:idsucursal/:idcodigo", (req, res) => {
  stockController.obtener_detalle_stock_sucursal(req,res)
});

router.post("/", (req, res) => {
  stockController.agregarStock(req,res);
});

router.patch("/:stockId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:stockId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;