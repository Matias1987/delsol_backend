const BancoDB = require("../database/Banco");
const obtenerBancos = (req, res, callback) => {
    BancoDB.obtenerBancos(
        (rows)=>{
            callback(rows)
        }
    );
}
const agregarBanco = (nuevo_banco,callback) => {
    BancoDB.agregarBanco(nuevo_banco,(id)=>{
        callback(id);
    });
}
const obtenerBanco = (req, res) => {}
const editarBanco = (req, res) => {}

module.exports = {
    obtenerBanco,
    obtenerBancos,
    agregarBanco,
    editarBanco
}