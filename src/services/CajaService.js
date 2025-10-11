const CajaDB = require("../database/Caja")

const caja_exists = (data,callback) => {
    CajaDB.caja_exists(data,(rows)=>{
        callback(rows)
    })
}

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

const obtener_caja_id = (idcaja, callback)=>{
    CajaDB.obtener_caja_id(idcaja,(rows)=>{
        return callback(rows);
    })
}

const caja_abierta = (idsucursal,callback) => {
    CajaDB.caja_abierta(idsucursal,(rows)=>{
        return callback(rows)
    })
}

const resumen_caja = (data, callback) => {
    CajaDB.resumen_caja(data,(response)=>{
        return callback(response)
    })
}

const obtener_cajas_fecha = (fecha, callback) => {
    CajaDB.obtener_cajas_fecha(fecha, (rows) => {
        return callback(rows);
    });
}

module.exports={
    agregarCaja,
    cerrarCaja,
    obtener_caja,
    informe_caja,
    obtenerCajasSucursal,
    obtener_caja_id,
    caja_abierta,
    caja_exists,
    resumen_caja,
    obtener_cajas_fecha,
}