const usuarioService = require("../services/UsuarioService")
const jwt = require('jsonwebtoken');
const config = require("../../config")

const obtener_autorizaciones_pendientes =  (req,res)=>{
  const {params:{idsucursal}} = req;
  usuarioService.obtener_autorizaciones_pendientes(idsucursal,(rows)=>{
    res.status(201).send({status:'OK', data: rows});
  })
}

const cambiar_estado_autorizacion = (req,res)=>{
  const {body} = req;
  usuarioService.cambiar_estado_autorizacion(body,(resp)=>{
    res.status(201).send({status:'OK', data: resp});
  })
}

const check_session = (req,res) => {
  const {params:{uid, sucursalid}} = req
  usuarioService.check_session(uid,sucursalid,(resp)=>{
    res.status(201).send({status:'OK', data: resp});
  })
}

const create_session = (req,res) => {
  const {body} = req
  usuarioService.create_session(body,(resp)=>{
    res.status(201).send({status:'OK', data: resp});
  })
}

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
    sucursal: body.sucursal||"-1",
  }

  usuarioService.validarLogin(user_data,(resp)=>{
    //console.log(resp)
    if(resp.logged==1){
      
      /*req.session.user = user_data.name;
      req.session.logedIn = true;

      res.status(201).send({status:'OK', data: {loged:1}});*/
      let multipleInstances = +(resp.udata.multInstances||"0")==1;
      let token = multipleInstances ? 'sometoken' : jwt.sign( {username: user_data.name}, config.secret, { expiresIn: '1h' // expires in 24 hours
        }
      );

      usuarioService.addToken({nombre: body.nombre, password: body.password, sucursal: body.sucursal, token: token},(_resp)=>{
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

const get_user_credentials = (req, res) => {
  const {body} = req
  usuarioService.get_user_credentials(body,(resp)=>{
    res.status(403).send({status:'OK', data: resp});
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

const obtenerUsuarios = (req, res) => {
  usuarioService.obtenerUsuarios((rows)=>{
    res.status(201).send({status:'OK', data: rows});
  })
}

const obtenerUsuario = (req, res) => {}

const agregarUsuario = (req, res) => {
  const {body} = req;


  usuarioService.agregarUsuario(body,(id)=>{
    res.status(201).send({status:'OK', data: id});
  })

}

const editarUsuario = (req, res) => {}


const obtener_detalle_vendedor = (req, res) => {
  const {params:{usuarioId}} = req;
  usuarioService.obtener_detalle_vendedor(usuarioId,(rows)=>{
    res.status(201).send({status:'OK', data: rows});
  })
}

const obtener_usuarios_permisos = (req, res) => {
  usuarioService.obtener_usuarios_permisos((rows)=>{
    res.status(201).send({status:'OK', data: rows});
  })
}

const modificar_permisos = (req, res) => {
  const {body} = req
  usuarioService.modificar_permisos(body,(resp)=>{
    res.status(201).send({status:'OK', data: resp});
  })
}

const obtener_vendedores = (req, res) => {
  usuarioService.obtener_vendedores((rows)=>{
    res.status(201).send({status:'OK', data: rows});
  })
}

module.exports = {
    obtener_vendedores,
    modificar_permisos,
    obtenerUsuarios,
    obtenerUsuario,
    agregarUsuario,
    editarUsuario,
    login,
    logout,
    user_is_logged,
    obtener_detalle_vendedor,
    check_session,
    create_session,
    obtener_autorizaciones_pendientes,
    cambiar_estado_autorizacion,
    obtener_usuarios_permisos,
    get_user_credentials,
  };