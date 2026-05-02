const db = require('../database/TrabajoMultiple');

/*
{
    "idcliente":0,
    "idsucursal": 0,
    "idusuario": 0,
    "fecha":"",
    "fechaRetiro":"",
    "estado": "",
    "estadoLaboratorio":"",
    "enLaboratorio":"",
    "anulado":0,
    "monto": 0,
    "comentarios": "",
    "descuento":0,
    "montoTotal": 0,
    "trabajos": [
        {
            "tipo":"cristales_laboratorio",
            "nro":"1",
            "items":[
                {
                    "idcodigo": 0,
                    "idtrabajo": 0,
                    "iddescuento": 0,
                    "tipo": "od",
                    "cantidad": "1",
                    "precio":"0",
                    "esf":"0",
                    "cil":"0",
                    "eje":"0"
                },
                {
                    "idcodigo": 0,
                    "idtrabajo": 0,
                    "iddescuento": 0,
                    "tipo": "od",
                    "cantidad": "1",
                    "precio":"0",
                    "esf":"0",
                    "cil":"0",
                    "eje":"0"
                }
            ]
        },
		{
            "tipo":"cristales_laboratorio",
            "nro":"2",
            "items":[
                {
                    "idcodigo": 0,
                    "idtrabajo": 0,
                    "iddescuento": 0,
                    "tipo": "od",
                    "cantidad": "1",
                    "precio":"0",
                    "esf":"0",
                    "cil":"0",
                    "eje":"0"
                },
                {
                    "idcodigo": 0,
                    "idtrabajo": 0,
                    "iddescuento": 0,
                    "tipo": "od",
                    "cantidad": "1",
                    "precio":"0",
                    "esf":"0",
                    "cil":"0",
                    "eje":"0"
                }
            ]
        },
    ]
}
*/

const procesarTrabajoMultiple = (data, callback) => {
    console.log("data recibida en servicio de trabajo multiple: ", data);
    //return callback({ ok: 1 });
    //for testing
    const products_quantities = [];

    /*data.trabajos.forEach(trabajo => {
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
    });*/

    /**
     * check stock
     */
    controlarStock(products_quantities, data.idsucursal, (response) => {
        if (response.error) {
            return callback({ error: 1, msg: "error validating quantities" });
        }
        agregarVenta(data, (response0) => {
            if (response0.error) {
                    return callback({ error: 1, msg: "error inserting venta" });
                }
            const idVenta = response0.idventa;

            const _trabajos = data.trabajos.map(trabajo => {
                return { ...trabajo, idventa: idVenta }
            });

            console.log("trabajos a insertar: ", _trabajos);

            agregarTrabajoMultiple(_trabajos, data.idsucursal, idVenta, (response1) => {
                if (response1.error) {
                    return callback({ error: 1, msg: "error inserting operations" });
                }
                descontarStock(idVenta, data.idsucursal, (response2) => {
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

const agregarTrabajoMultiple = (trabajos, idsucursal, idventa, callback) => {
    if(!trabajos || trabajos.length == 0) {
        return callback({ msg: "no more trabajos to process" });
    }
    const trabajo = trabajos.shift();
    console.log("trabajo a insertar: ", trabajo);
    db.agregarTrabajo(trabajo, idventa, response=>{
        db.agregarTabajoItems(trabajo, response.idtrabajo, idventa, idsucursal , response=>{
            if (response.error) {
                return callback({ error: 1, msg: "error inserting trabajo items" });
            }
            agregarTrabajoMultiple(trabajos, idsucursal, idventa, callback);
        })
    })
}

const descontarStock = (data, idsucursal, callback) => {
    return callback({ ok: 1 });
}

const controlarStock = (data, idsucursal, callback) => {
    console.log("controlando stock para los siguientes productos: ", data); 
    return callback({ ok: 1 });//for now, we will not control stock quantities, but in the future we will implement this function to check if there is stock available for the products in the venta
    //check using db quantities
    db.checkQuantities(products_quantities, response => {
        callback(response);
    })
}


module.exports = { procesarTrabajoMultiple }