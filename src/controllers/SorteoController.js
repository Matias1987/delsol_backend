const service = require("../services/SorteoService")

const generarSorteo =( req, res ) => {
    const {body} = req
    service.generarSorteo(body,(response)=>{
        res.status(201).send({data:response, status:'OK'})
    })
}
const obtenerParticipantesDistinct =( req, res ) => {
    const {body} = req
    service.obtenerParticipantesDistinct(body,(response)=>{
        res.status(201).send({data:response, status:'OK'})
    })
}
const obtenerTickets =( req, res ) => {
    const {body} = req
    service.obtenerTickets(body,(response)=>{
        res.status(201).send({data:response, status:'OK'})
    })
}
const determinarGanador =( req, res ) => {
    const {body} = req
    service.determinarGanador(body,(response)=>{
        res.status(201).send({data:response, status:'OK'})
    })
}
const obtenerSorteo =( req, res ) => {
    const {body} = req
    service.obtenerSorteo(body,(response)=>{
        res.status(201).send({data:response, status:'OK'})
    })
}


module.exports = {generarSorteo, obtenerParticipantesDistinct, determinarGanador, obtenerSorteo, obtenerTickets}