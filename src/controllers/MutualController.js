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
const obtenerTodasLasMutuales = (req,res) => {
    mutualService.obtenerMutuales((rows)=>{
        res.status(201).send({status:'OK', data:rows});
    },true)
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

const activar_mutual = (req,res) => {
    const {body} = req;
    mutualService.activar_mutual(body,(result)=>{
        res.status(201).send({status:'OK', data:result});
    })
}

const editarMutual = (req,res) => {}

module.exports = {
    activar_mutual,
    obtenerMutual,
    obtenerMutuales,
    agregarMutual,
    editarMutual,
    buscarMutual,
    obtenerTodasLasMutuales,
}