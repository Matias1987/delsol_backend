const express = require("express");

const controller = require("../../controllers/PedidoController");

const router = express.Router();


router.get("/:idpedido", (req, res) => {
  controller.crearPedido(req, res);
});

router.get("/", (req, res) => {
  controller.lista_pedidos(req, res);
});

router.post("/", (req, res) => {
  controller.crearPedido(req, res);
});

router.post("/update/", (req, res) => {
  controller.actualizar_pedido(req, res);
});

module.exports = router;
