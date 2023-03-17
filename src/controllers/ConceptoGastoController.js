const ConceptoGastoService = require("../services/ConceptoGastoService");

const obtenerConceptosGastos = (req,res) => {}

const agregarConceptoGasto = (req,res) => {

    const {body} = req;

    const nuevo_concepto_gasto = {
        'nombre' : body.nombre
    }

    ConceptoGastoService.agregarConceptoGasto(nuevo_concepto_gasto,
        (id)=>{
            res.status(201).send({status: 'OK', data: id});
        }  
        )

}

const editarConceptoGasto = (req,res) => {}

module.exports = {
    obtenerConceptosGastos,
    agregarConceptoGasto,
    editarConceptoGasto
}