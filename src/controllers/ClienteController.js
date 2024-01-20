const clienteService = require("../services/ClienteService")

const update_cliente = (req, res) => {
  const {body} = req;
  clienteService.update_cliente(body,(resp)=>{
    res.status(201).send({status:'OK', data: resp});
  })
}

const obtenerClientes = (req, res) => {
  clienteService.obtenerClientes((rows)=>{
    res.status(201).send({status:'OK', data: rows});
  })
}

const agregarCliente = (req, res) => {
  const {body} = req;

  const nuevo_cliente = {
    'localidad_idlocalidad' :  body.idlocalidad,
    'nombre' : body.nombres,
    'apellido' : body.apellidos,
    'direccion' : body.domicilio,
    'dni' : body.dni,
    'telefono1' : body.telefono,
    'telefono2' : "",//body.telefono2,
    'destinatario': typeof body.destinatario === 'undefined' ? 0 : body.destinatario,
    'fechaNac': body.fechaNac,
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

const lista_ventas_general = (req, res) => {
  const {params:{idcliente}} = req;
  clienteService.lista_ventas_general(idcliente,(rows)=>{
    res.status(201).send({status:'OK',data:rows});
  })
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

  //const {params:{clienteId}} = req;

  const {body} = req

  clienteService.operaciones_cliente(body, (rows)=>{

    res.status(201).send({status:'OK',data:rows});
    
  })
}

const obtener_saldo_ctacte = (req, res) => {

  const {params:{clienteId}} = req;

  clienteService.obtener_saldo_ctacte(clienteId, (rows)=>{

    res.status(201).send({status:'OK',data:rows});
    
  })
}

const actualizar_saldo_cliente = (req, res) => {
  const {params: {clienteId}} = req;
  clienteService.actualizar_saldo_cliente(clienteId,(resp)=>{
    res.status(201).send({status:'OK',data:resp});
  })
}

const actualizar_saldo_en_cobro = (req, res) => {
  const {params: {idcobro}} = req;
  clienteService.actualizar_saldo_en_cobro(idcobro,(resp)=>{
    res.status(201).send({status:'OK',data:resp});
  })
}

const bloquear_cuenta = (req, res) => {
  //const {params: {clienteId}} = req;
  const {body} = req
  clienteService.bloquear_cuenta(body,(resp)=>{
    res.status(201).send({status:'OK',data:resp});
  })
  
}

const desbloquear_cuenta = (req, res) => {
  const {params: {clienteId}} = req;
  clienteService.desbloquear_cuenta(clienteId,(resp)=>{
    res.status(201).send({status:'OK',data:resp});
  })
}

module.exports = {
    update_cliente,
    lista_ventas_general,
    bloquear_cuenta,
    desbloquear_cuenta,
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
    actualizar_saldo_cliente,
    actualizar_saldo_en_cobro,
  };