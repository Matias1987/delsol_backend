const express = require("express");
const router = express.Router();
const usuarioController = require("../../controllers/UsuarioController")

router.get("/", (req, res) => {
  usuarioController.obtenerUsuarios(req,res)
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

router.get("/l/sessions/:idsucursal", (req, res) => {
  //res.status(201).send({status:'OK',data:{loged:1}});
  usuarioController.obtener_autorizaciones_pendientes(req,res)
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
  usuarioController.create_session(req,res)
})

router.post("/update_s/",(req,res)=>{
  usuarioController.cambiar_estado_autorizacion(req,res)
})

router.patch("/:usuarioId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:usuarioId", (req, res) => {
  res.send("Delete an existing workout");
});

router.get("/l/a/s/obtener_usuarios_permisos/",(req,res)=>{

  usuarioController.obtener_usuarios_permisos(req,res)
})


module.exports = router;