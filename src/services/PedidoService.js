const db = require("../database/Pedido");

const crearPedido = (data, callback) => {
  db.insert_pedido(data, (response) => {
    return callback(response);
  });
};
const actualizar_pedido = (data, callback) => {
  db.actualizar_pedido(data, (response) => {
    return callback(response);
  });
};
const lista_pedidos = (data, callback) => {
  db.lista_pedidos(data, (response) => {
    return callback(response);
  });
};
const detalle_pedido = (data, callback) => {
  db.detalle_pedido(data, (response) => {
    return callback(response);
  });
};

module.exports = {
  crearPedido,
  actualizar_pedido,
  lista_pedidos,
  detalle_pedido,
};
