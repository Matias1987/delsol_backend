const express = require("express");
const router = express.Router();
const cuentaBancariaController = require("../../controllers/CuentaBancariaController");

router.get("/",(req,res)=>{cuentaBancariaController.listaCuentasBancarias(req,res)});

router.post("/",(req,res)=>{cuentaBancariaController.agregarCuentaBancaria(req,res)});

router.post("/activar/",(req,res)=>{cuentaBancariaController.activarCuentaBancaria(req,res)});


module.exports = router;