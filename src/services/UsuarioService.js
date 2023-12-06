const UsuarioDB = require("../database/Usuario")

const obtener_autorizaciones_pendientes = (idsucursal, callback) => {
  UsuarioDB.obtener_autorizaciones_pendientes(idsucursal,(rows)=>{
    return callback(rows)
  })
}

const cambiar_estado_autorizacion = (data,callback)=>{
  UsuarioDB.cambiar_estado_autorizacion(data,(response)=>{
    return callback(response)
  })
}

const check_session = (uid,sucursalid, callback ) => {
  UsuarioDB.check_session(uid,sucursalid,(resp)=>{return callback(resp)})
}

const create_session = (data, callback) => {
  UsuarioDB.create_session(data,(resp)=>{return callback(resp)})
}

const checkIfUserLoggedIn = (token, callback)=>{
  UsuarioDB.checkIfUserLoggedIn(token,(res)=>{
    callback(res)
  })
}

const addToken = (data,callback) => {
  UsuarioDB.setToken(data,(resp)=>{
    callback(resp);
  })
}

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

const obtener_detalle_vendedor = (data,callback) =>{
  UsuarioDB.obtener_detalle_vendedor(data,(row)=>{
    return callback(row)
  })
}

module.exports = {
    obtenerUsuarios,
    obtenerUsuario,
    agregarUsuario,
    editarUsuario,
    validarLogin,
    logout,
    addToken,
    checkIfUserLoggedIn,
    obtener_detalle_vendedor,
    check_session,
    create_session,
    obtener_autorizaciones_pendientes,
    cambiar_estado_autorizacion,
  };