const service = require("../services/ListaService");

const AgregarMedicoALista = (req,res) => {
    const {body} = req;

    service.AgregarMedicoALista(body,(response)=>{
        res.status(201).send({status:'OK', data:response});
    })

}

const ObtenerNombreListasPorTipo = (req,res) => {
    const {body} = req;

    service.ObtenerNombreListasPorTipo(body,(response)=>{
        res.status(201).send({status:'OK', data:response});
    })
}

module.exports = {AgregarMedicoALista, ObtenerNombreListasPorTipo}