const express = require("express");
const router = express.Router();
const subfamiliaController = require("../../controllers/SubFamiliaController")

router.get("/", (req, res) => {
  subfamiliaController.obtenerSubFamilias(req,res)
});

router.get("/:subfamiliaId", (req, res) => {
  res.send("Get an existing workout");
});

router.get("/optionsforfamilia/:familiaId", (req, res) => {
  subfamiliaController.obtener_subfamilias_byfamilia_opt(req,res);
});


router.post("/", (req, res) => {
  subfamiliaController.agregarSubFamilia(req,res)
});

router.patch("/:subfamiliaId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:subfamiliaId", (req, res) => {
  res.send("Delete an existing workout");
});

router.post("/obtener/subfamilias/familias",(req, res)=>{
  subfamiliaController.obtener_subfamilias_de_familias(req, res)
})

module.exports = router;