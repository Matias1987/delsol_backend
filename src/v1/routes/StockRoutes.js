const express = require("express");
const router = express.Router();
const stockController = require("../../controllers/StockController")

router.get("/:idsucursal", (req, res) => {
  stockController.obtenerListaStock(req,res)
});

router.get("/get/subgrupos/full/list/", (req, res) => {
  stockController.obtener_subgrupo_full(req,res)
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

router.get("/search_stock_envio/:idsucursal/:idsucursal_destino/:search_value/:idcodigo/:categoria/:idcat", (req, res) => {
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

router.get("/detalle_stock_venta/:idsucursal/:idcodigo", (req,res)=>{
  stockController.obtener_stock_detalles_venta(req,res)
})

router.post("/", (req, res) => {
  stockController.agregarStock(req,res);
});

router.post("/obtener_stock_ventas/", (req, res) => {
  stockController.obtener_stock_ventas(req,res);
});

router.post("/m/incrementar_cantidad/", (req, res) => {
  stockController.incrementar_cantidad(req,res);
});

router.post("/m/descontar_cantidad_por_codigo/", (req, res) => {
  stockController.descontar_cantidad_por_codigo(req,res);
});

router.post("/m/modificar_cantidad_categoria/", (req, res) => {
  stockController.modificar_cantidad_categoria(req,res);
});

router.post("/verificar_cantidades_productos/", (req, res) => {
  stockController.verificar_cantidades_productos(req,res);
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

router.post("/filtro_stock/", (req, res) => {
  stockController.obtener_lista_stock_filtros(req,res);
});

router.post("/modificar_cantidad/",(req,res)=>{
  stockController.modificar_cantidad(req,res)
})

router.post("/obtener_grilla_stock/",(req, res)=>{
  stockController.obtener_grilla_stock(req, res)
})
router.post("/modificar_cantidad_lista/",(req,res)=>{
  stockController.modificar_cantidad_lista(req,res)
})

module.exports = router;