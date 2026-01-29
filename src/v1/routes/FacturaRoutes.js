const express = require("express");

const facturaController = require("../../controllers/FacturaController");

const router = express.Router();

router.get("/:idproveedor?", (req, res) => {
    facturaController.obtener_facturas(req,res)
});

router.get("/df/:idfactura", (req, res) => {
  facturaController.detalle_factura(req,res);
});
router.get("/elementos/:idfactura", (req, res) => {
  facturaController.lista_elementos_factura(req,res);
});
router.get("/mont/adic/fact/:idfactura", (req, res) => {
  facturaController.obtener_factura_montos_adic(req,res);
});
router.post("/detalle/factura/nro/", (req, res) => {
  facturaController.lista_elementos_factura(req,res);
});

router.post("/", (req, res) => {
    facturaController.agregar_factura(req,res)
});

router.post("/obtener/fact/uras/filtros/",(req, res)=>{
  facturaController.obtener_facturas_filtros(req, res)
})

router.post("/obtener/facturas/saldo/",(req, res)=>{
  facturaController.obtener_facturas_saldo(req, res)
})

router.patch("/:facturaId", (req, res) => {
  res.send("actualizar una factura");
});

router.delete("/:facturaId", (req, res) => {
  res.send("eliminar factura (logica)");
});

module.exports = router;