const CajaDB = require("../database/Caja")

const obtener_caja = (idsucursal, callback) =>{
    CajaDB.obtener_caja(idsucursal,(resp)=>{
        callback(resp)
    })
}

const obtenerCajasSucursal = (idsucursal,callback)=>{
    CajaDB.obtener_lista_cajas_sucursal(idsucursal,(rows)=>{
        return callback(rows)
    })
}

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

const informe_caja = (idcaja, callback) => {
    CajaDB.informe_caja(idcaja,(resp)=>{
        return callback(resp)
    })

}


module.exports={
    
    agregarCaja,
    cerrarCaja,
    obtener_caja,
    informe_caja,
    obtenerCajasSucursal
}