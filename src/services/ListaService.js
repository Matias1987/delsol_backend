const db = require("../database/Lista")

const AgregarMedicoALista = ({idmedico,nombreLista},callback) => {
    db.AgregarElementoLista({tipo:"MEDICO",nombre: nombreLista, id: idmedico},(response)=>{
        return callback(response)
    })
}

const ObtenerNombreListasPorTipo = ({tipo},callback) => {
    db.ObtenerNombreListasPorTipo({tipo},(response)=>{
        return callback(response)
    })
}

module.exports = {AgregarMedicoALista, ObtenerNombreListasPorTipo};