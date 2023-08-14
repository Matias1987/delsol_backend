const usuarioService = require("../services/UsuarioService")
const jwt = require('jsonwebtoken');
const config = require("../../config")


const user_is_logged = (req,res) => {
  const {params:{token}} = req;

  usuarioService.checkIfUserLoggedIn(token,(_res)=>{
    res.status(201).send({status:'OK', data: _res});
  })


  /*if(req.session == null){
    console.log("session is null")
    res.status(201).send({status:'OK', data: {loged:0}});
  }
  else{
    console.log(JSON.stringify(req.session))
    res.status(201).send({status:'OK', data: {loged:1}});
  }*/

}



const login = (req,res)=>{
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  const {body} = req;

  const user_data = {
    name: body.nombre,
    pass: body.password,
  }

  usuarioService.validarLogin(user_data,(resp)=>{
    //console.log(resp)
    if(resp.logged==1){
      
      /*req.session.user = user_data.name;
      req.session.logedIn = true;

      res.status(201).send({status:'OK', data: {loged:1}});*/

      let token = jwt.sign({username: user_data.name},
        config.secret,
        { expiresIn: '1h' // expires in 24 hours
        }
      );

      usuarioService.addToken({nombre: body.nombre, password: body.password, token: token},(_resp)=>{
        res.status(201).send({
          status:'OK', 
          data: {
            success: true,
            logged: 1,
            uid: resp.uid,
            message: 'Authentication successful!',
            token: token,
            udata: resp.udata
            
          }
        });
      })

      
    }
    else{
      res.status(403).send({status:'OK', data: {success: false, message: 'Authentication failed!'}});
    }

  })

}

const logout = (req,res) => {
  const {params:{token}} = req ;

  
  usuarioService.logout(token,(_res)=>{
    //console.log("destroy session")
    //req.session.destroy()
    res.send({status:'OK', data: {logged:0}});
  })
  
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
    user_is_logged,
  };