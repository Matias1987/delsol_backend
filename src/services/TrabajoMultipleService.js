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
        agregarVenta(data, (response0) => {
            if (response0.error) {
                    return callback({ error: 1, msg: "error inserting venta" });
                }
            const idVenta = response0.data.insertId;
            agregarTrabajoMultiple(data, idVenta,  (response1) => {
                if (response1.error) {
                    return callback({ error: 1, msg: "error inserting operations" });
                }
                descontarStock(idVenta, idsucursal, (response2) => {
                    if (response2.error) {
                        return callback({ error: 1, msg: "error when trying to discount stock quantities" });
                    }
                    return callback({ ok: 1 });
                })
            });
        });

    })

}

const agregarVenta = (data, callback) => {
    db.agregarVenta(data,response=>{
        callback?.(response)
    })
}

const agregarTrabajoMultiple = (data, idsucursal, callback) => {
    db.agregarTrabajoMultiple(data, idsucursal, response=>{
        callback?.(response)
    })
}

const descontarStock = (data, idsucursal, callback) => {

}

const controlarStock = (data, idsucursal, callback) => {

    //check using db quantities
    db.checkQuantities(products_quantities, response => {
        callback(response);
    })
}


module.exports = { procesarTrabajoMultiple }