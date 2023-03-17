const MutualDB = require("../database/Mutual")

const obtenerMutuales = (req,res) => {}
const obtenerMutual = (req,res) => {}
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
    editarMutual
}