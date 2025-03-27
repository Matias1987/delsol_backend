const db = require("../database/Image")

const agregar_imagen = (data, callback) => {
    db.agregar_imagen(data,(response)=>{
        callback(response)
    })
}

const obtener_imagenes = (data, callback) =>
{
    db.obtener_imagenes(data,(response)=>{
        callback(response)
    })
}

const remover_imagen = (data, callback) => {
    db.remover_imagen(data, (response)=>{
        callback(response)
    })
}


const get_default_image = (data, callback) => {
    db.get_default_image(data,(resp)=>{
        callback(resp)
    })
}

module.exports = {agregar_imagen, obtener_imagenes, remover_imagen, get_default_image}