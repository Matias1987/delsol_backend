const ICDB = require("../database/InteresCuota")

const obtenerInteresCuotas = (callback) => {
    ICDB.obtenerInteresCuotas((rows)=>{
        return callback(rows)
    })
}

const modifInteresCuota = (data,callback) => 
{

}

module.exports = {obtenerInteresCuotas,modifInteresCuota}