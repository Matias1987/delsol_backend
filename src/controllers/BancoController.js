const bancoService = require("../services/BancoService")
const obtenerBancos = (req, res) => {
    bancoService.obtenerBancos(req,res,(rows)=>{
        res.send({status:"OK", data: rows})
    });
    

}
const agregarBanco = (req, res) => {
    const {body} = req;

    const nuevo_banco = {
        nombre: body.nombre
    }

    bancoService.agregarBanco(nuevo_banco, (id)=>{
        res.status(201).send({status:'OK', data:id});
    });
    
}

const obtenerBanco = (req, res) => {}
const editarBanco = (req, res) => {}

const desactivar_banco = (req, res) => {
    //const {params:{idbanco}} = req
    const {body} =  req
    bancoService.desactivar_banco(body,(resp)=>{
        res.send({status:"OK", data: resp})
    })
}   

module.exports = {
    desactivar_banco,
    obtenerBanco,
    obtenerBancos,
    agregarBanco,
    editarBanco
}