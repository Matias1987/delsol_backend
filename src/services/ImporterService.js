const db = require("../database/Importer")

const procesar_data = (data, callback) => {
    db.importar(data,(response)=>{
        callback(response)
    })
}

module.exports={procesar_data}