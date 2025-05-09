const express = require("express");
const router = express.Router();

const clienteController = require("../../controllers/ClienteController")

router.get("/", (req, res) => {
  clienteController.obtenerClientes(req,res);
});

router.get("/buscar/:values", (req, res) => {
  clienteController.buscarCliente(req,res);
});

router.get("/ventas_gral/:idcliente", (req, res) => {
  clienteController.lista_ventas_general(req,res);
});

/*
router.get("/bloquear/:clienteId", (req, res) => {
  console.log("bloquear")
  clienteController.bloquear_cuenta(req,res);
});*/
router.post("/bloquear/", (req, res) => {
  console.log("bloquear")
  clienteController.bloquear_cuenta(req,res);
});

router.get("/desbloquear/:clienteId", (req, res) => {
  console.log("desbloquear")
  clienteController.desbloquear_cuenta(req,res);
});

router.get("/:clienteId", (req, res) => {
 clienteController.obtenerClientePorID(req,res)
});

router.post("/operaciones/", (req, res) => {
 clienteController.operaciones_cliente(req,res)
});

router.post("/cl/a/f/l/",(req, res)=>{
  clienteController.add_flag(req,res)
})

router.get("/actualizar_saldo_en_cobro/:idcobro", (req, res) => {
 clienteController.actualizar_saldo_en_cobro(req,res)
});
router.get("/actualizar_saldo_cliente/:clienteId", (req, res) => {
 clienteController.actualizar_saldo_cliente(req,res)
});

router.get("/saldo/ctacte/:clienteId", (req, res) => {
 clienteController.obtener_saldo_ctacte(req,res)
});

router.get("/get/ultimas/graduaciones/cliente/:idcliente",(req,res)=>{
  clienteController.obtener_ultimas_graduaciones(req,res)
})

router.post("/", (req, res) => {
  clienteController.agregarCliente(req,res);
});

router.post("/getPorDNI/", (req, res) => {
  clienteController.obtenerClientePorDNI(req,res);
});

router.post("/edit_c/",(req,res)=>{
  clienteController.update_cliente(req,res)
});


router.post("/g/cl/m/",(req, res)=>{
  clienteController.obtener_clientes_morosos(req, res)
})

router.patch("/:clienteId", (req, res) => {
  res.send("Update an existing workout");
});

router.delete("/:clienteId", (req, res) => {
  res.send("Delete an existing workout");
});

module.exports = router;