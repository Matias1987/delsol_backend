const express = require("express");
const router = express.Router();
const usuarioController = require("../../controllers/UsuarioController")

router.get("/", (req, res) => {
  res.send("Get all workouts");
});

router.get("/:usuarioId", (req, res) => {
  res.send("Get an existing workout");
});

router.post("/login/",(req,res)=>{
  usuarioController.login(req,res)
})

router.post("/", (req, res) => {
  usuarioController.agregarUsuario(req,res);
});

router.patch("/:usuarioId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:usuarioId", (req, res) => {
  res.send("Delete an existing workout");
});


module.exports = router;