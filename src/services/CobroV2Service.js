const db = require("../database/CobroV2")

const agregarCobro = (data,  callback) =>{

    switch(data.tipo)
    {
        case "ingreso": return db.agregarCobroIngreso(data,response=>{callback(response)}); break;
        case "resfuerzo": return db.agregarCobroResfuerzo(data,response=>{callback(response)}); break;
        case "entrega": return db.agregarCobroEntrega(data,response=>{callback(response)}); break;
    }

}

module.exports = {agregarCobro}