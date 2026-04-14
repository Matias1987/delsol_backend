const db = require('../database/TrabajoMultiple');

const procesarTrabajoMultiple = (data, callback) => {
    const products_quantities = [];
    data.trabajos.forEach(trabajo => {
        trabajo.items.forEach(item => {
            if (item.mustCheckStock) {
                if (p = products_quantities.find(p => p.idcodigo == item.idcodigo)) {
                    products_quantities = products_quantities.map(_p => _p.idcodigo == item.idcodigo ? { ..._p, cantidad: _p.cantidad + item.cantidad } : _p);
                }
                else {
                    products_quantities.push({ idcodigo: item.idcodigo, cantidad: item.cantidad });
                }
            }
        })
    })
        ;
    /**
     * check stock
     */
    controlarStock(products_quantities, idsucursal, (response) => {
        if (response.error) {
            return callback({ error: 1, msg: "error validating quantities" });
        }
        agregarTrabajoMultiple(data, (response1) => {
            if (response1.error) {
                return callback({ error: 1, msg: "error inserting operations" });
            }
            descontarStock(products_quantities, idsucursal, (response2) => {
                if (response1.error) {
                    return callback({ error: 1, msg: "error inserting operations" });
                }
                return callback({ok:1});
            })
        })
    })

}

const agregarTrabajoMultiple = (data, callback) => {

}

const descontarStock = (data, idsucursal, callback) => {

}

const controlarStock = (data, idsucursal, callback) => {

    //check using db quantities
    db.checkQuantities(products_quantities, response => {
        callback(response);
    })
}


module.exports = {procesarTrabajoMultiple}