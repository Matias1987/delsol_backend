const eventoService = require("../services/EventoService");

const register_event = (req, res) => {
    const {body} = req
    eventoService.register_event(body,(resp)=>{
        res.status(201).send({status:'OK', data: "ok"});
    })
}

const get_events  = (req,res) => {
    const {body} = req
    eventoService.get_events(body,(rows)=>{
        res.status(201).send({status:'OK', data: rows});
    })
}

module.exports = {register_event, get_events,}