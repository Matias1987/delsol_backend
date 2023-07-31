const ConceptoGastoDB = require("../database/ConceptoGasto");

const obtenerConceptosGastos = (callback) => {
    ConceptoGastoDB.obtenerConceptosGastos((rows)=>{
        return callback(rows)
    })
}
const agregarConceptoGasto = (data,callback) => {
    ConceptoGastoDB.agregarConceptoGasto(data,(id)=>{
        return callback(id);
    })
}
const editarConceptoGasto = (req,res) => {}

module.exports = {
    obtenerConceptosGastos,
    agregarConceptoGasto,
    editarConceptoGasto
}