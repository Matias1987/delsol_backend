const CajaDB = require("../database/Caja")

const obtener_caja = (idsucursal, callback) =>{
    CajaDB.obtener_caja(idsucursal,(resp)=>{
        callback(resp)
    })
}

const obtenerCajas = (req,res)=>{}

const agregarCaja = (data,callback)=>{
    CajaDB.agregarCaja(data,(id)=>{
        return callback(id);
    })
}

const cerrarCaja = (idcaja, callback) => {
    CajaDB.cerrarCaja(idcaja,(resp)=>{
        return callback(resp)
    })

}




module.exports={
    obtenerCajas,
    agregarCaja,
    cerrarCaja,
    obtener_caja,
}