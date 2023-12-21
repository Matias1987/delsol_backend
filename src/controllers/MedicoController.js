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
    const nuevo_medico = {
        'nombre': body.nombre,
        'matricula': body.matricula,
    }
    medicoService.agregarMedico(nuevo_medico,(medico_id)=>{
        //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(201).send({status: 'OK', data: medico_id});
    })
}
const editarMedico = (req,res) => {}


module.exports = {
    obtenerMedico,
    obtenerMedicos,
    agregarMedico,
    editarMedico,
    buscarMedico,
    ventas_medico_totales,
    ventas_medico,
}