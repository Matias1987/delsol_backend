const service = require("./VentaService");
const ventaDB = require("../database/Venta");

const guardarCambiosVenta = (data, callback) => {
    /**
     * remove venta items
     * remove venta mp
     * restore quantities
     */
    ventaDB.inc_cantidades_stock_venta({ idventa: data.idventa }, (resp) => {
        console.log(
            "Stock restaurado por modificacion de venta id: " + data.idventa,
        );
        ventaDB.eliminar_venta_mp({ idventa: data.idventa }, resp1 => {
            if (!resp1) {
                return callback({ error: "1", msg: "error al eliminar venta mp" });
            }
            ventaDB.eliminar_venta_stock({ idventa: data.idventa }, resp2 => {
                if (!resp2) {
                    return callback({ error: "2", msg: "error al eliminar venta stock" });
                }
                service.agregarVenta({...data, edicion:true}, response => {
                    callback(response);
                })
            })
        })
    });


}

module.exports = {guardarCambiosVenta}