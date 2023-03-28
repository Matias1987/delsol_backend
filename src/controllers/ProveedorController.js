const proveedorService = require("../services/ProveedorService")

const agregar_proveedor = (req,res) => {
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

module.exports = {
    agregar_proveedor,obtener_proveedores,
}