const UsuarioDB = require("../database/Usuario")

const validarLogin = (data,callback) => {
  UsuarioDB.validar_usuario_login(data,(res)=>{
    return callback(res)
  })
}

const logout = (data,callback) => {
  UsuarioDB.logout(data,(res)=>{
    return callback(res)
  })
}

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
    validarLogin,
    logout,
  };