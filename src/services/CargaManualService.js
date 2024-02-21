const cargaManualDB = require("../database/CargaManual");

const obtenerCargasManuales = (req,res) => {}

const obtenerCargasManualesCliente  = (req,res) => {}

const agregarCargaManual  = (data,callback) => {
    cargaManualDB.agregarCargaManual(data,(id)=>{
        return callback(id)
    })
}

const anularCargaManual = (data,callback)=>{
    cargaManualDB.anularCargaManual(data,(resp)=>{
        return callback(resp)
    })
}

const obtenerCargaManual = (idcargamanual, callback) => {
    cargaManualDB.obtenerCargaManual(idcargamanual,(row)=>{
        callback(row)
    })
}

const modificarCargaManual = (data,callback) => {
    cargaManualDB.modificar_carga_manual(data,(resp)=>{
        callback(resp)
    })
}

const editarCargaManual = (req,res) => {
    
}


module.exports = {
    obtenerCargaManual,
    modificarCargaManual,
    obtenerCargasManuales,
    obtenerCargasManualesCliente,
    agregarCargaManual,
    editarCargaManual,
    anularCargaManual,
}