const express = require("express");
const router = express.Router();
const usuarioController = require("../../controllers/UsuarioController")

router.get("/", (req, res) => {
  res.send("Get  allworkouts");
});

router.get("/:usuarioId", (req, res) => {
  res.send("Get an existing workout");
});
router.get("/l/logout/:token", (req, res) => {
  usuarioController.logout(req,res)
});

router.get("/l/checklogin/:token", (req, res) => {
  //res.status(201).send({status:'OK',data:{loged:1}});
  usuarioController.user_is_logged(req,res)
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