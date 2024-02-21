const cargaManualService = require("../services/CargaManualService");

const obtenerCargasManuales = (req,res) => {}

const obtenerCargasManualesCliente  = (req,res) => {}

const agregarCargaManual  = (req,res) => {
    const {body} = req;

    /*const nueva_carga_manual = {
        'caja_idcaja':body.caja_idcaja,
        'usuario_idusuario':body.usuario_idusuario,
        'cliente_idcliente':body.cliente_idcliente,
        'sucursal_idsucursal':body.sucursal_idsucursal,
        'monto':body.monto,
        'concepto':body.concepto,
    }*/

    cargaManualService.agregarCargaManual(body,(id)=>{
        res.status(201).send({status:'OK', data: id});
    })
}

const editarCargaManual = (req,res) => {
    const {body} = req
    cargaManualService.modificarCargaManual(body,(resp)=>{
        res.status(201).send({status:'OK'})
    })
}

const obtenerCargaManual = (req,res)=>{
    const {params:{idcargamanual}} = req
    cargaManualService.obtenerCargaManual(idcargamanual,(row)=>{
        res.status(201).send({status:'OK', data: row})
    })
}

const anularCargaManual = (req,res) => {
    const {body} = req
    cargaManualService.anularCargaManual(body,(resp)=>{
        res.status(201).send({status:'OK'})
    })
}


module.exports = {
    obtenerCargaManual,
    obtenerCargasManuales,
    obtenerCargasManualesCliente,
    agregarCargaManual,
    editarCargaManual,
    anularCargaManual,

}