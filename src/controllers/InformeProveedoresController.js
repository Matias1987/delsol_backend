const service = require("../services/InformeProveedoresService")
const  saldo_proveedores_lista = (req, res) => {
    service.saldo_proveedores_lista(null,(response)=>{
        res.status(201).send({status:'OK', data:response})
    })
}

module.exports = {saldo_proveedores_lista}