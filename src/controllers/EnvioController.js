const envioService = require("../services/EnvioService");

const obtenerEnvios = (req,res) => {
    envioService.obtenerEnvios((rows)=>{
        res.status(201).send({status: 'OK', data:rows});
    })
}

const agregarEnvio = (req,res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    const {body} = req;

    const nuevo_envio = {
        'sucursal_idsucursal' : body.sucursal_idsucursal,
        'usuario_idusuario' : body.usuario_idusuario,
        'cantidad_total' : body.cantidad_total,
        'items' : body.items
    }

    envioService.agregarEnvio(nuevo_envio,(id)=>{
        res.status(201).send({status:'OK', data: id});
    })

}

const editarEnvio = (req,res) => {}


module.exports = {
    obtenerEnvios,
    agregarEnvio,
    editarEnvio
}