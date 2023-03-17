const ClienteDB = require("../database/Cliente")

const obtenerClientes = (callback) => {
  ClienteDB.obtener_lista_clientes((rows) => {
    return callback(rows);
  })
}

const agregarCliente = (data, callback) => {
  ClienteDB.agregar_cliente(data, (id) => {
    return callback(id);
  })
}

const obtenerCliente = (data, callback) => {
  ClienteDB.detalle_cliente_dni(data, (row) => {
    return callback(row);
  })
}

const obtenerFichaCliente = (req, res) => {}

const editarCliente = (req, res) => {}


module.exports = {
    obtenerClientes,
    agregarCliente,
    obtenerCliente,
    obtenerFichaCliente,
    editarCliente,
  };