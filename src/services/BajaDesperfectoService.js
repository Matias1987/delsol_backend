const BajaDesperfectoDB = require("../database/BajaDesperfecto");

const obtener_lista = (callback)=>{
    BajaDesperfectoDB.obtener_lista((rows)=>{
        return callback(rows)
    })
}

const agregarBajaDesperfecto = (_data, callback) => {

    BajaDesperfectoDB.agregarBajaDesperfecto(_data,(resp)=>{
        return callback(resp)
    })

}

    module.exports = {agregarBajaDesperfecto, obtener_lista,}