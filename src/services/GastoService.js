const GastoDB = require("../database/Gasto")


const obtenerGastosSucursal = (idsucursal, callback) => {
    GastoDB.obtener_gastos_sucursal(idsucursal,(rows)=>{
        return callback(rows)
    })
}


const obtenerGastosCaja = (idcaja, callback) => {
    GastoDB.obtener_gastos_caja(idcaja,(rows)=>{
        return callback(rows)
    })
}

const obtenerGasto = (req,res) => {}

const agregarGasto = (data,callback) => {
    GastoDB.agregar_gasto(data,(id)=>{
        return callback(id);
    })
}

const editarGasto = (req,res) => {}



module.exports = {
    obtenerGasto,
    obtenerGastosSucursal,
    agregarGasto,
    editarGasto,
    obtenerGastosCaja,
}