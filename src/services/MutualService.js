const MutualDB = require("../database/Mutual")

const buscarMutual = (value,callback)=>{
    MutualDB.buscar_mutual(value,(rows)=>{
        callback(rows)
    })
}

const obtenerMutuales = (callback) => {
    MutualDB.obtener_mutuales((rows)=>{
        callback(rows)
    })
}
const obtenerMutual = (id, callback) => {
    MutualDB.obtener_mutual(id,(rows)=>{
        callback(rows)
    })
}
const agregarMutual = (data,callback) => {

    MutualDB.agregar_mutual(data,(id)=>{
        return callback(id);
    })

}
const editarMutual = (req,res) => {}

module.exports = {
    obtenerMutual,
    obtenerMutuales,
    agregarMutual,
    editarMutual,
    buscarMutual,
}