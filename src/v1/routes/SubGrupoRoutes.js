const express = require("express");
const router = express.Router();
const subGrupoController = require("../../controllers/SubGrupoController");

router.get("/listado/subgrupos/:idgrupo?", (req, res) => {
  subGrupoController.obtenerSubgrupos(req,res)
});

router.get("/:subgrupoId", (req, res) => {
  subGrupoController.obtener_detalle_subgrupo(req,res)
});

router.get("/optionsforgrupo/:grupoId", (req, res) => {
  subGrupoController.obtener_subgrupos_bygrupo_opt(req,res);
});
router.get("/descripcion_cat_subgrupo/:subgrupoId", (req, res) => {
  subGrupoController.obtener_descripcion_cat_subgrupo(req,res);
});
router.get("/subgrupos_subfamilia/:idsubfamilia", (req, res) => {
  subGrupoController.obtener_subgrupos_grupo(req,res);
});

router.post("/", (req, res) => {
  subGrupoController.agregarSubgrupo(req,res);
});

router.post("/modificar_multiplicador/", (req, res) => {
  //console.log("modificar mult.")
  subGrupoController.modificar_multiplicador(req,res)
});
router.post("/modificar_precios_defecto/", (req, res) => {
  //console.log("modificar_precios_defecto")
  subGrupoController.modificar_precios_defecto(req,res)
});

router.post("/m/modif_sg",(req,res)=>{
 
  subGrupoController.editarSubgrupo(req,res)
 
})

router.patch("/:subgrupoId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:subgrupoId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;