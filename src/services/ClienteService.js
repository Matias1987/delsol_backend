const ClienteDB = require("../database/Cliente")

const update_cliente = (data,callback) => {
  ClienteDB.update_cliente(data,(resp)=>{
    return callback(resp)
  })
}

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
const obtener_saldo_ctacte = (data, callback) => {
  ClienteDB.obtener_saldo_ctacte(data, (rows) => {
    return callback(rows);
  })
}

const actualizar_saldo_cliente = (idcliente, callback) => {
  ClienteDB.actualizar_saldo_cliente(idcliente,(resp)=>{
    return callback(resp)
  })
}

const actualizar_saldo_en_cobro = (idcobro, callback) => {
  ClienteDB.actualizar_saldo_en_cobro(idcobro,(resp)=>{
    return callback(resp)
  })
}

const bloquear_cuenta = (data, callback) => {
  ClienteDB.bloquear_cuenta(data,(resp)=>{
    return callback(resp)
  })
}

const desbloquear_cuenta = (idcuenta, callback) => {
  ClienteDB.desbloquear_cuenta(idcuenta,(resp)=>{
    return callback(resp)
  })
}

const lista_ventas_general = (idcliente, callback) => {
  ClienteDB.lista_ventas_general(idcliente,(rows)=>{
    return callback(rows)
  })
}

module.exports = {
    update_cliente,
    lista_ventas_general,
    bloquear_cuenta,
    desbloquear_cuenta,
    obtenerClientes,
    agregarCliente,
    obtenerClienteDNI,
    obtenerClienteID,
    obtenerFichaCliente,
    editarCliente,
    buscarCliente,
    operaciones_cliente,
    obtener_saldo_ctacte,
    actualizar_saldo_cliente,
    actualizar_saldo_en_cobro,
  };