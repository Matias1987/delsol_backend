const medicoService = require("../services/MedicoService");

const obtenerMedicos = (req,res) => {}
const obtenerMedico = (req,res) => {}
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
    editarMedico
}