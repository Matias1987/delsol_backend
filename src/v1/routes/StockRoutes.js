const express = require("express");
const router = express.Router();
const stockController = require("../../controllers/StockController")

router.get("/:idsucursal", (req, res) => {
  stockController.obtenerListaStock(req,res)
});


router.get("/porsubgrupo/:idsubgrupo", (req, res) => {
  stockController.obtener_stock_por_subgrupo(req,res)
});
router.get("/cod_sin_stock_s/:idsucursal", (req, res) => {
  stockController.obtener_codigos_sin_stock_sucursal(req,res)
});

router.get("/search/:idsucursal/:search_value", (req, res) => {
  stockController.search_stock(req,res)
});

router.get("/search_stock_envio/:idsucursal/:idsucursal_destino/:search_value", (req, res) => {
  stockController.search_stock_envio(req,res)
});

router.get("/detalle/:idsucursal/:idcodigo", (req, res) => {
  stockController.obtener_detalle_stock_sucursal(req,res)
});

router.get("/stock_sucursal/:idsucursal/:idcodigo", (req, res) => {
  stockController.obtener_stock_sucursal(req,res)
});
router.get("/stock_sucursales/:idcodigo", (req, res) => {
  stockController.stock_codigo_sucursales(req,res)
});

router.get("/exists/:idsucursal/:idcodigo", (req,res)=>{
  stockController.obtener_stock_sucursal(req,res)
})

router.post("/", (req, res) => {
  stockController.agregarStock(req,res);
});

router.post("/m/modificar_cantidad/", (req, res) => {
  stockController.modificar_cantidad(req,res);
});


router.patch("/:stockId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:stockId", (req, res) => {
  res.send("Delete an existing workout");
});

router.post("/agregar_stock/lote/", (req, res) => {
  stockController.agregar_stock_lote(req,res);
});

module.exports = router;