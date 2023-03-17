const UsuarioDB = require("../database/Usuario")

const obtenerUsuarios = (req, res) => {}

const obtenerUsuario = (req, res) => {}

const agregarUsuario = (data,callback) => {
  UsuarioDB.agregar_usuario(data,(id)=>{
    return callback(id);
  })
}

const editarUsuario = (req, res) => {}


module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    agregarUsuario,
    editarUsuario,
  };