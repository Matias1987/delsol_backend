const mutualService = require("../services/MutualService");

const buscarMutual = (req,res) => {
    const {params:{value}} = req;
    mutualService.buscarMutual(
        value,
        (rows)=>{
            res.status(201).send({status:'OK', data:rows});
        }
    )
}

const obtenerMutuales = (req,res) => {
    mutualService.obtenerMutuales((rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })
}

const obtenerMutual = (req,res) => {
    const {params:{idmutual}} = req;
    mutualService.obtenerMutual(idmutual,(rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })
}

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
    editarMutual,
    buscarMutual,
}