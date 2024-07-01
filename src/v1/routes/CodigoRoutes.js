const express = require("express");
const router = express.Router();
const codigoController = require("../../controllers/CodigoController")

router.get("/", (req, res) => {
  codigoController.obtenerCodigos(req,res)
});

router.get("/:codigoId", (req, res) => {
  codigoController.obtenerCodigoPorId(req,res)
});
router.get("/lista_por_categoria/:idfamilia/:idsubfamilia/:idgrupo/:idsubgrupo/:modo_precio", (req, res) => {
  codigoController.obtener_codigos_categoria(req,res)
});

router.post("/porcodigo/", (req,res)=>{
  codigoController.obtenerCodigo(req,res)
});

router.get("/search/:search_param", (req, res) => {
  codigoController.search_codigos(req,res)
});

router.get("/optforsubgrupo/:subgrupoId", (req, res) => {
  codigoController.obtener_codigos_bysubgrupo_opt(req,res);
});

router.post("/", (req, res) => {
  codigoController.agregarCodigo(req,res);
});

router.post("/editar_c/",(req,res)=>{
  codigoController.editar_codigo(req,res)
})

router.post("/codigos_filtros/",(req,res)=>{
  codigoController.obtener_codigos_filtros(req,res)
})

router.post("/editar_lote/",(req,res)=>{
  codigoController.editar_lote_codigos(req,res)
})

router.post("/cod/editar/stock/ideal/",(req,res)=>{
  console.log("kjdskfjasñlkdfjñlsajfñlasjfdlksjfñlksdjf")
  codigoController.editar_cantidad_ideal(req,res)
})

router.patch("/:codigoId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:codigoId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;