const EventoDB = require("../database/Evento")

const register_event = (data,callback) => {
    EventoDB.register_event(data,(resp)=>{
        callback(resp)
    })
}

const get_events  = (callback) => {
    EventoDB.get_events((rows)=>{
        callback(rows)
    })
}

module.exports = {register_event, get_events,}