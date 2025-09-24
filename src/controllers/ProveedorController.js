const proveedorService = require("../services/ProveedorService")

const agregar_proveedor = (req,res) => {
    //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const {body} = req;

    const data = {
        cuit: body.cuit,
        nombre: body.nombre
    }

    proveedorService.agregar_proveedor(
        data,
        (id) => {
            res.status(201).send({status:'OK', data:id})
        }

    )
    
}

const obtener_proveedores = (req,res) => {
    //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    proveedorService.obtener_proveedores((rows)=>{
        res.status(201).send({status:'OK', data:rows})
    })
}

const obtener_ficha_proveedor = (req, res) => {
    
    const {body} = req

    proveedorService.obtener_ficha_proveedor(body,(rows)=>{
        res.status(201).send({status:'OK',data:rows})
    })

}

const detalle_proveedor = (req, res) => {
    const {params:{proveedorId}} = req
    proveedorService.detalle_proveedor(proveedorId,(rows)=>{
        res.status(201).send({status:'OK',data:rows})
    })
}

const agregar_cm_proveedor = (req, res) => {
    const {body} = req

    proveedorService.agregar_cm_proveedor(body,(rows)=>{
        res.status(201).send({status:'OK',data:rows})
    })
}

const agregar_pago_proveedor = (req, res) => {
    const {body} = req

    proveedorService.agregar_pago_proveedor(body,(rows)=>{
        res.status(201).send({status:'OK',data:rows})
    })
}

const pagos_atrasados_proveedores = (req, res) => {
    proveedorService.pagos_atrasados_proveedores({},(response)=>{
        res.status(201).send({status:'OK',data:response})
    })
}

module.exports = {
    agregar_cm_proveedor,
    agregar_pago_proveedor,
    agregar_proveedor,
    obtener_proveedores, 
    obtener_ficha_proveedor,
    detalle_proveedor,
    pagos_atrasados_proveedores,
}