const clienteService = require("../services/ClienteService")

const obtenerClientes = (req, res) => {}

const agregarCliente = (req, res) => {
  const {body} = req;

  const nuevo_cliente = {
    'localidad_idlocalidad' : body.localidad_idlocalidad,
    'nombre' : body.nombre,
    'apellido' : body.apellido,
    'direccion' : body.direccion,
    'dni' : body.dni,
    'telefono1' : body.telefono1,
    'telefono2' : body.telefono2,
  }

  clienteService.agregarCliente(nuevo_cliente,
    (id)=>{
      res.status(201).send({status:'OK', data: id});
    })
}

const obtenerClientePorDNI = (req, res) => {
  const {body} = req;
  const id = body.id;
  clienteService.obtenerCliente(
    id,(rows)=>{
      res.status(201).send({status:'OK',data:rows});
    }
  );
}
const obtenerClientePorID = (req, res) => {
  const {body} = req;
  const id = body.id;
  clienteService.obtenerCliente(
    id,(rows)=>{
      res.status(201).send({status:'OK',data:rows});
    }
  );
}
const obtenerClientePorNombre = (req, res) => {
  const {body} = req;
  const id = body.id;
  clienteService.obtenerCliente(
    id,(rows)=>{
      res.status(201).send({status:'OK',data:rows});
    }
  );  
}

const obtenerFichaCliente = (req, res) => {}

const editarCliente = (req, res) => {}

module.exports = {
    obtenerClientes,
    agregarCliente,
    obtenerClientePorDNI,
    obtenerClientePorID,
    obtenerClientePorNombre,
    obtenerFichaCliente,
    editarCliente,
  };