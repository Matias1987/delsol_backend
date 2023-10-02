const express = require("express");
const ventaController = require("../../controllers/VentaController");
const router = express.Router();

router.get("/", (req, res) => {
  ventaController.obtenerVentas(req,res)
});

router.get("/:ventaId", (req, res) => {
  ventaController.obtenerVenta(req,res)
});

router.get("/get_venta_items/:ventaId", (req, res) => {
  ventaController.lista_venta_item(req,res)
});

router.get("/obtener_datos_pagare/:ventaId", (req, res) => {
  ventaController.obtener_datos_pagare(req,res)
});

router.get("/obtener_categorias_productos_venta/:ventaId", (req, res) => {
  ventaController.obtener_categorias_productos_venta(req,res)
});

router.get("/obtener_lista_pagares/:clienteId", (req, res) => {
  ventaController.obtener_lista_pagares(req,res)
});



router.get("/get_venta_mp/:ventaId", (req, res) => {
  ventaController.obtenerVentaMP(req,res)
});

router.get("/get_venta_mp_ctacte/:ventaId", (req, res) => {
  ventaController.obtenerVentaMPCtaCte(req,res)
});

router.post("/", (req, res) => {
  ventaController.agregarVenta(req,res)
});

router.post("/cambiar_estado/", (req, res) => {
  ventaController.cambiar_estado_venta(req,res)
});

router.post("/desc_cantidades_stock_venta/", (req, res) => {
  ventaController.desc_cantidades_stock_venta(req,res)
});

router.post("/inc_cantidades_stock_venta/", (req, res) => {
  ventaController.inc_cantidades_stock_venta(req,res)
});

router.post("/cambiar_venta_sucursal_deposito/", (req, res) => {
  ventaController.cambiar_venta_sucursal_deposito(req,res)
});

router.post("/venta_estado_sucursal/", (req, res) => {
  ventaController.lista_venta_sucursal_estado(req,res)
});

router.patch("/:ventaId", (req, res) => {
  ventaController.editarVenta(req,any)
});

router.delete("/:ventaId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;