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

module.exports = {
    obtenerBanco,
    obtenerBancos,
    agregarBanco,
    editarBanco
}