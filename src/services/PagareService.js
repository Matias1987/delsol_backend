const PagareDB = require("../database/Pagare")


const agregarPagare = ( data,callback ) => {
    PagareDB.agregarPagare(data,(resp)=>
    {
        callback(resp)
    })
}

const obtenerPagaresCliente = (data,callback) => {
    PagareDB.obtenerPagaresCliente(data, (resp)=>{
        callback(resp)
    })
}

const obtenerPagare = (data,callback) => {
    PagareDB.obtenerPagare(data,(resp)=>{
        callback(resp)
    })
}

module.exports = {obtenerPagaresCliente,obtenerPagare, agregarPagare}