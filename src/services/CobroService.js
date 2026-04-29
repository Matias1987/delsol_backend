const CobroDB = require("../database/CobroV2")
const ClienteOpinionService = require("./ClienteOpinionService")
const obtenerCobros = (data,callback) => {
  CobroDB.lista_cobros(data, (rows)=>{
    return callback(rows)
  })
}

const agregarCobro = (data,callback) => {
  
  CobroDB.agregar_cobro(data,(id)=>{
    return callback(id);
  });

  if(data.comentario_cliente)
  {
    ClienteOpinionService.agregarOpinion({
      idcliente: data.idcliente,
      idventa: data.idventa||null,
      idsucursal: data.sucursal_idsucursal||null,
      idvendedor: data.usuario_idusuario||null,
      puntaje: data.puntaje_cliente||'0',
      comentario: data.comentario_cliente,
      tipo_operacion: 'acercamiento'
    }, (resp)=>{
      console.log(resp);
    });
  }
}

const obtenerCobro = (idcobro, callback) => {
  CobroDB.detalle_cobro(idcobro,(row)=>{
    return callback(row)
  })
}

const lista_mp_cobro = (idcobro, callback) => {
  CobroDB.lista_mp_cobro(idcobro,(rows)=>{
    return callback(rows)
  })
}

const anular_cobro = (data, callback) => {
  CobroDB.anular_cobro(data,(resp)=>{
    return callback(resp)
  })
}

const editarCobro = (req, res) => {}

module.exports = {
    obtenerCobros,
    agregarCobro,
    obtenerCobro,
    editarCobro,
    lista_mp_cobro,
    anular_cobro,
  };