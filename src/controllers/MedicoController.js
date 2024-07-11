const medicoService = require("../services/MedicoService");

const ventas_medico = (req, res)=>{
    const {body} = req
    medicoService.ventas_medico(body,(rows)=>{
        res.status(201).send({status:'OK', data:rows})
    })
    
}
const ventas_medico_totales = (req, res)=>{
    const {body} = req
    medicoService.ventas_medico_totales(body,(rows)=>{
        res.status(201).send({status:'OK', data:rows})
    })
    
}

const buscarMedico = (req,res) =>{
    const {params:{value}} = req;
    medicoService.buscarMedico(value,(rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })
}

const obtenerMedicos = (req,res) => {
    medicoService.obtenerMedicos((rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })
}
const obtenerMedico = (req,res) => {
    const {params:{idmedico}} = req;
    medicoService.obtenerMedico(idmedico,(rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })
}
const agregarMedico = (req,res) => {
    const {body} = req;
   
    medicoService.agregarMedico(body,(medico_id)=>{
        
        res.status(201).send({status: 'OK', data: medico_id});
    })
}
const editarMedico = (req,res) => {}

const deshabilitar_medico = (req,res)=>{
    const {body} = req
    medicoService.deshabilitar_medico(body,(resp)=>{
        res.status(201).send({status:'OK', data: resp})
    })
}

module.exports = {
    deshabilitar_medico,
    obtenerMedico,
    obtenerMedicos,
    agregarMedico,
    editarMedico,
    buscarMedico,
    ventas_medico_totales,
    ventas_medico,
}