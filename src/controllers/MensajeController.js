const mensajeService = require("../services/MensajeService")

const obtener_mensajes = (req,res) => {
    mensajeService.obtener_mensajes((rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })
}

const agregar_mensaje = (req,res) => {
    const {body} = req;
    mensajeService.agregar_mensaje(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp});
    })
}   

module.exports = {obtener_mensajes, agregar_mensaje}
