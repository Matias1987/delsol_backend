const mutualService = require("../services/MutualService");

const obtenerMutuales = (req,res) => {}

const obtenerMutual = (req,res) => {}

const agregarMutual = (req,res) => {
    const {body} =req;
    
    const nueva_mutual ={
        'nombre': body.nombre
    }
    mutualService.agregarMutual(nueva_mutual, (id)=>{
        res.status(201).send({status:'OK', data:id});
    })

}
const editarMutual = (req,res) => {}

module.exports = {
    obtenerMutual,
    obtenerMutuales,
    agregarMutual,
    editarMutual
}