const tagService = require("../services/TagService")

const agregar_tag = (req, res) => {
    const {body} = req
    tagService.agregar_tag(body,(resp)=>{
        res.status(201).send({status:'OK',data:resp});
    })
}

const agregar_tag_codigo = (req, res) => {
    const {body} = req
    tagService.agregar_tag_codigo(body,(resp)=>{
        res.status(201).send({status:'OK',data:resp});
    })
}

const obtener_lista_tag_codigo = (req, res) => {
    const {body} = req
    tagService.obtener_lista_tag_codigo(body,(resp)=>{
        res.status(201).send({status:'OK',data:resp});
    })
}

const obtener_lista_tag = (req, res) => {
    const {body} = req
    tagService.obtener_lista_tag(body,(resp)=>{
        res.status(201).send({status:'OK',data:resp});
    })
}

const agregar_categoria = (req, res) => {
    const {body} = req
    tagService.agregar_categoria(body,(resp)=>{
        res.status(201).send({status:'OK',data:resp});
    })
}
 
const obtener_lista_categorias = (req, res) => {

    tagService.obtener_lista_categorias({},(resp)=>{
        res.status(201).send({status:'OK',data:resp});
    })
}

module.exports = {
    agregar_categoria, 
    agregar_tag, 
    obtener_lista_categorias, 
    obtener_lista_tag, 
    agregar_tag_codigo, 
    obtener_lista_tag_codigo}