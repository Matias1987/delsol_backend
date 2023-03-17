const CajaDB = require("../database/Caja")


const obtenerCajas = (req,res)=>{}

const agregarCaja = (data,callback)=>{
    CajaDB.agregarCaja(data,(id)=>{
        return callback(id);
    })
}

const cerrarCaja = (req,res) => {}


module.exports={
    obtenerCajas,
    agregarCaja,
    cerrarCaja
}