const ventaTallerService = require(".././services/VentaTallerService")

const agregar_pedido = (req, res) => {
    const {body}=req
    ventaTallerService.agregar_pedido(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })    
}

const marcar_como_calibrando = (req, res) => {
    const {body}=req
    ventaTallerService.marcar_como_calibrando(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })
}

const marcar_como_terminado = (req, res) => {
    const {body}=req
    ventaTallerService.marcar_como_terminado(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })
}

const obtener_items_operacion= (req, res) => {
    const {body}=req
    ventaTallerService.obtener_items_operacion(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })
}

const obtener_lista_operaciones = (req, res) => {
    const {body}=req
    ventaTallerService.obtener_lista_operaciones(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })

}

const marcar_como_laboratorio = (req, res) => {
    const {body}=req
    ventaTallerService.marcar_como_laboratorio(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })
}

const informe_consumo_periodo = (req, res) => {
    const {body}=req
    ventaTallerService.informe_consumo_periodo(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })
}

const detalle_consumo_codigo = (req, res) => {
    const {body}=req
    ventaTallerService.detalle_consumo_codigo(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })
}

module.exports = {
    marcar_como_calibrando, 
    marcar_como_terminado, 
    agregar_pedido, 
    obtener_lista_operaciones, 
    obtener_items_operacion,
    marcar_como_laboratorio,
    informe_consumo_periodo,
    detalle_consumo_codigo
}
