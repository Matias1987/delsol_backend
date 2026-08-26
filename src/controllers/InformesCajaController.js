const service = require("../services/InformesCajaService");

const listaTotalCobrosCuotaMes = (req, res) => {};
const listaTotalGastosMes = (req, res) => {};
const montoIngresoCategoria = (req, res) => {
    const {body} = req;
    service.montoIngresoCategoria(body,(response)=>{
        res.send({status:"OK",data:response});
    })
};
const montoEgresoCategoria = (req, res) => {
    const {body} = req;
    service.montoEgresoCategoria(body,(response)=>{
        res.send({status:"OK",data:response});
    })
};
const operacionesEgresoIngresoSucursal = (req, res) => {
    const {body} = req;
    service.operacionesEgresoIngresoSucursal(body,(response)=>{
        res.send({status:"OK",data:response});
    })
};

module.exports = {
  listaTotalCobrosCuotaMes,
  listaTotalGastosMes,
  montoIngresoCategoria,
  montoEgresoCategoria,
  operacionesEgresoIngresoSucursal
};
