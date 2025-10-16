const db = require("../database/InformesProveedores")

const saldo_proveedores_lista = (data, callback) => {
    db.saldo_proveedores_lista(data,(response)=>{
        callback(response)
    })
}

module.exports={saldo_proveedores_lista}