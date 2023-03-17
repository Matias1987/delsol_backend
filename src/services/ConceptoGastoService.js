const ConceptoGastoDB = require("../database/ConceptoGasto");

const obtenerConceptosGastos = (req,res) => {}
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