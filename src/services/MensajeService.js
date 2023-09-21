const MensajeDB = require("../database/Mensaje");

const obtener_mensajes = (callback) => {
    MensajeDB.obtener_mensajes((rows)=>{
        return callback(rows)
    })
}
const agregar_mensaje = (data,callback) => {
    MensajeDB.agregar_mensaje(data,(resp)=>{
        return callback(resp)
    })
}

module.exports = {obtener_mensajes,agregar_mensaje}

/*const _value = decodeURIComponent(value);
    const query = `SELECT * FROM medico m WHERE m.nombre LIKE '%${_value}%';`;
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(query, (err,rows)=>{
        return callback(rows)
    })
    connection.end(); */