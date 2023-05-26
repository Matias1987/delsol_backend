const envioService = require("../services/EnvioService");

const obtenerEnvios = (req,res) => {
    envioService.obtenerEnvios((rows)=>{
        res.status(201).send({status: 'OK', data:rows});
    })
}

const obtenerEnvio = (req,res) => {
    //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  const {params:{idenvio}} = req
  envioService.obtenerEnvio(idenvio,(id)=>{
    res.status(201).send({status: 'OK', data:id});
  })
}
const agregarEnvio = (req,res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    const {body} = req;
    console.log("body: ", JSON.stringify( body))
    const nuevo_envio = {
        'sucursal_idsucursal' : body.sucursal_idsucursal,
        'usuario_idusuario' : body.usuario_idusuario,
        'cantidad_total' : body.cantidad_total,
        'id_sucursal_origen': body.id_sucursal_origen,
        'items' : []/*body.items*/
    }
    

    body.items.forEach((e)=>{
        nuevo_envio.items.push(
            {
                codigo_idcodigo: e.key,
                cantidad: e.cantidad,
            }
        )
    })

    envioService.agregarEnvio(nuevo_envio,(id)=>{
        res.status(201).send({status:'OK', data: id});
    })

}

const editarEnvio = (req,res) => {}

const obtener_envios_codigo = (req,res) => {

    const {params:{idcodigo}} = req;

    envioService.obtener_envios_codigo(idcodigo,(rows)=>{
        res.status(201).send({status:'OK', data: rows});
    })

}


module.exports = {
    obtenerEnvio,
    obtenerEnvios,
    agregarEnvio,
    editarEnvio,
    obtener_envios_codigo,
}