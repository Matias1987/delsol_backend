const cargaManualDB = require("../database/CargaManual");

const obtenerCargasManuales = (req,res) => {}

const obtenerCargasManualesCliente  = (req,res) => {}

const agregarCargaManual  = (data,callback) => {
    cargaManualDB.agregarCargaManual(data,(id)=>{
        return callback(id)
    })
}

const editarCargaManual = (req,res) => {}


module.exports = {
    obtenerCargasManuales,
    obtenerCargasManualesCliente,
    agregarCargaManual,
    editarCargaManual
}