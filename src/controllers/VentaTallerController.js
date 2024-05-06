const ventaTallerService = require(".././services/VentaTallerService")

const agregar_pedido = (req, res) => {
    ventaTallerService.agregar_pedido(req,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })    
}

const marcar_como_calibrando = (req, res) => {
    ventaTallerService.marcar_como_calibrando(req,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })
}

const marcar_como_terminado = (req, res) => {
    ventaTallerService.marcar_como_terminado(req,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })
}

const obtener_items_operacion= (req, res) => {
    ventaTallerService.obtener_items_operacion(req,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })
}

const obtener_lista_operaciones = (req, res) => {
    ventaTallerService.obtener_lista_operaciones(req,(resp)=>{
        res.status(201).send({status:'OK', data:resp})
    })

}

module.exports = {
    marcar_como_calibrando, 
    marcar_como_terminado, 
    agregar_pedido, 
    obtener_lista_operaciones, 
    obtener_items_operacion}
