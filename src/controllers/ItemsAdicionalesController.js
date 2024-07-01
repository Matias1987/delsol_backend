const ItemsAdicionalesService = require("../services/ItemsAdicionalesService")

const agregar_item_adicional = (req, res) => {
    const {body} = req
    ItemsAdicionalesService.agregar_item_adicional(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp});
    })
}

const obtener_uso_items_adic_subgrupo_periodo = (req, res) => {
    const {body} = req
    ItemsAdicionalesService.obtener_uso_items_adic_subgrupo_periodo(body,(resp)=>{
        res.status(201).send({status:'OK', data:resp});
    })
}

const obtener_adicionales_venta = (req, res) => {
    const {params:{idventa}} = req
    ItemsAdicionalesService.obtener_adicionales_venta(idventa,(rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })
}


module.exports = {agregar_item_adicional, obtener_adicionales_venta, obtener_uso_items_adic_subgrupo_periodo}