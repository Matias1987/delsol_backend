const usuarioService = require("../services/UsuarioService")

const obtenerUsuarios = (req, res) => {}

const obtenerUsuario = (req, res) => {}

const agregarUsuario = (req, res) => {
  const {body} = req;

  const nuevo_usuario = {
    'nombre': body.nombre,
    'password': body.password
  }

  usuarioService.agregarUsuario(nuevo_usuario,(id)=>{
    res.status(201).send({status:'OK', data: id});
  })

}

const editarUsuario = (req, res) => {}


module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    agregarUsuario,
    editarUsuario,
  };