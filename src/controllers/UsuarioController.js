const usuarioService = require("../services/UsuarioService")

const user_is_loged = (req,res) => {
  if(req.session == null){
    res.status(201).send({status:'OK', data: {loged:0}});
  }
  else{
    if(req.session.logedIn){
      res.status(201).send({status:'OK', data: {loged:1}});
    }
    else{
      res.status(201).send({status:'OK', data: {loged:0}});
    }
  }

}

const login = (req,res)=>{
  const {body} = req;

  const user_data = {
    name: body.nombre,
    pass: body.password,
  }

  usuarioService.validarLogin(user_data,(resp)=>{

    if(resp.length>0){
      
      req.session.user = user_data.name;
      req.session.logedIn = true;

      res.status(201).send({status:'OK', data: {loged:1}});
    }
    else{
      res.status(201).send({status:'OK', data: {loged:0}});
    }

  })

}

const logout = (req,res) => {
  req.session.destroy();
  res.send({status:'OK', data: {loged:0}});
}

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
    login,
    logout,
    user_is_loged,
  };