const envioHasStockService = require("../services/EnvioHasStockService");

const obtenerEnvioStock = (req,res) => {
    //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const {params:{idenvio}} = req;

    envioHasStockService.obtenerEnvioStock(idenvio, (rows)=>{
        res.status(201).send({status:'OK',data:rows});
    })

}
const agregarEnvioStock = (req,res) => {}
const editarEnvioStock = (req,res) => {}
const eliminarEnvioStock = (req,res) => {}

module.exports = {
    obtenerEnvioStock,
    agregarEnvioStock,
    editarEnvioStock,
    eliminarEnvioStock
}