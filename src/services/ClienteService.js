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

const obtenerClienteDNI = (data, callback) => {
  ClienteDB.detalle_cliente_dni(data, (row) => {
    return callback(row);
  })
}
const obtenerClienteID = (data, callback) => {
  ClienteDB.detalle_cliente(data, (row) => {
    return callback(row);
  })
}

const buscarCliente = (data, callback) => {
  ClienteDB.buscar_cliente(data, (rows) => {
    return callback(rows);
  })
}

const obtenerFichaCliente = (req, res) => {}

const editarCliente = (req, res) => {}

const operaciones_cliente = (data, callback) => {
  ClienteDB.operaciones_cliente(data, (rows) => {
    return callback(rows);
  })
}


module.exports = {
    obtenerClientes,
    agregarCliente,
    obtenerClienteDNI,
    obtenerClienteID,
    obtenerFichaCliente,
    editarCliente,
    buscarCliente,
    operaciones_cliente,
  };