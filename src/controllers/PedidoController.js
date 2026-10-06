const service = require("../services/PedidoService");

const crearPedido = (req, res) => {
  const { body } = req;
  service.crearPedido(body, (response) => {
    res.json(response);
  });
};
const actualizar_pedido = (req, res) => {
  const { body } = req;
  service.actualizar_pedido(body, (response) => {
    res.json(response);
  });
};
const lista_pedidos = (req, res) => {
  const {params: { idsucursal_origen, tipo, idsucursal_dest }} = req;
  service.lista_pedidos({ idsucursal_origen, tipo, idsucursal_dest }, (response) => {
    res.json(response);
  });
};
const detalle_pedido = (req, res) => {
  const {
    params: { idpedido },
  } = req;
  service.detalle_pedido({ idpedido }, (response) => {
    res.json(response);
  });
};

module.exports = {
  crearPedido,
  actualizar_pedido,
  lista_pedidos,
  detalle_pedido,
};
