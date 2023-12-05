const express = require("express");
const router = express.Router();
const usuarioController = require("../../controllers/UsuarioController")

router.get("/", (req, res) => {
  res.send("Get  allworkouts");
});

router.get("/:usuarioId", (req, res) => {
  usuarioController.obtener_detalle_vendedor(req,res)
});
router.get("/l/logout/:token", (req, res) => {
  usuarioController.logout(req,res)
});

router.get("/l/checklogin/:token", (req, res) => {
  //res.status(201).send({status:'OK',data:{loged:1}});
  usuarioController.user_is_logged(req,res)
});


router.get("/checks/:uid/:sucursalid",(req,res)=>{
  usuarioController.check_session(req,res)
})



router.post("/login/",(req,res)=>{
  //console.log("login.......")
  usuarioController.login(req,res)
})

router.post("/", (req, res) => {
  
  usuarioController.agregarUsuario(req,res);
});

router.post("/adds/",(req,res)=>{
  //console.log("ADDDDDS")
  usuarioController.create_session(req,res)
})

router.patch("/:usuarioId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:usuarioId", (req, res) => {
  res.send("Delete an existing workout");
});


module.exports = router;