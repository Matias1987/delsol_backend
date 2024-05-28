const tagDB = require("../database/Tag")

const agregar_tag_codigo = (data,callback) => {
    tagDB.agregar_tag_codigo(data,(resp)=>{callback(resp)})
}

const agregar_tag = (data,callback) => {
    tagDB.agregar_tag(data,(resp)=>{callback(resp)})
}

const obtener_lista_tag = (data,callback) => {
    tagDB.obtener_lista_tag(data,(resp)=>{callback(resp)})
}

const agregar_categoria = (data,callback) => {
    tagDB.agregar_categoria(data,(resp)=>{callback(resp)})
}

 
const obtener_lista_categorias = (data,callback) => {
    tagDB.obtener_lista_categorias(data,(resp)=>{callback(resp)})
}

const obtener_lista_tag_codigo = (data,callback) => {
    tagDB.obtener_lista_tag_codigo(data,(resp)=>{callback(resp)})
}

module.exports = {
    agregar_categoria, 
    agregar_tag, 
    obtener_lista_categorias, 
    obtener_lista_tag, 
    agregar_tag_codigo,
    obtener_lista_tag_codigo}