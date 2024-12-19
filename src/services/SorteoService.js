const db = require("../database/Sorteo")

const generarSorteo = (data, callback) =>{
    db.generarSorteo(data,(response)=>{
        callback(response)
    })
}
const obtenerParticipantesDistinct = (data, callback) =>{
    db.obtenerParticipantesDistinct(data,(response)=>{
        callback(response)
    })
}
const obtenerTickets = (data, callback) =>{
    db.obtenerTickets(data,(response)=>{
        callback(response)
    })
}
const determinarGanador = (data, callback) =>{
    db.determinarGanador(data,(response)=>{
        callback(response)
    })
}
const obtenerSorteo = (data, callback) =>{
    db.obtenerSorteo(data,(response)=>{
        callback(response)
    })
}


module.exports = {generarSorteo, obtenerParticipantesDistinct, determinarGanador, obtenerSorteo, obtenerTickets}