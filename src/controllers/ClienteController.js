const clienteService = require("../services/ClienteService")

const obtenerClientes = (req, res) => {
  clienteService.obtenerClientes((rows)=>{
    res.status(201).send({status:'OK', data: rows});
  })
}

const agregarCliente = (req, res) => {
  const {body} = req;

  const nuevo_cliente = {
    'localidad_idlocalidad' : null,// body.localidad_idlocalidad,
    'nombre' : body.nombres,
    'apellido' : body.apellidos,
    'direccion' : body.domicilio,
    'dni' : body.dni,
    'telefono1' : body.telefono,
    'telefono2' : ""//body.telefono2,
  }

  clienteService.agregarCliente(nuevo_cliente,
    (id)=>{
      res.status(201).send({status:'OK', data: id});
    })
}

const obtenerClientePorDNI = (req, res) => {
  const {body} = req;
  clienteService.obtenerClienteDNI(
    body.dni,(rows)=>{
      res.status(201).send({status:'OK',data:rows});
    }
  );
}
const obtenerClientePorID = (req, res) => {
  const {params:{clienteId}} = req;
  clienteService.obtenerClienteID(
    clienteId,(rows)=>{
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

const buscarCliente = (req,res) =>{
  const {params:{values}} = req;
  clienteService.buscarCliente(values, (rows)=>{
    res.status(201).send({status:'OK',data:rows});
  })
}

const obtenerFichaCliente = (req, res) => {}

const editarCliente = (req, res) => {}


const operaciones_cliente = (req, res) => {

  const {params:{clienteId}} = req;

  clienteService.operaciones_cliente(clienteId, (rows)=>{

    res.status(201).send({status:'OK',data:rows});
    
  })
}

const obtener_saldo_ctacte = (req, res) => {

  const {params:{clienteId}} = req;

  clienteService.obtener_saldo_ctacte(clienteId, (rows)=>{

    res.status(201).send({status:'OK',data:rows});
    
  })
}

module.exports = {
    obtenerClientes,
    agregarCliente,
    obtenerClientePorDNI,
    obtenerClientePorID,
    obtenerClientePorNombre,
    obtenerFichaCliente,
    editarCliente,
    buscarCliente,
    operaciones_cliente,
    obtener_saldo_ctacte,
  };