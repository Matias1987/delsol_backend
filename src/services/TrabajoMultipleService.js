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

const procesarTrabajoMultiple = (_data, callback) => {
    const data = {
        idcaja: _data.fkcaja,
        idcliente: _data.fkcliente,
        idsucursal: _data.fksucursal,
        comentarios: _data.comentarios,
        idusuario: _data.fkusuario,
        fechaRetiro: "2026-05-14",
        estado: "PENDIENTE",
        estadoLaboratorio: "",
        enLaboratorio: 1,
        anulado: 0,
        monto: _data.subtotal,
        descuento: _data.descuento,
        montoTotal: _data.total,
        trabajos: _data.trabajos,
        descuento: _data.descuento,
    };
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

            agregarTrabajoMultiple(_trabajos, data.idsucursal, idVenta, (response1) => {
                if (response1.error) {
                    return callback({ error: 1, msg: "error inserting operations" });
                }
                descontarStock(idVenta, data.idsucursal, (response2) => {
                    if (response2.error) {
                        return callback({ error: 1, msg: "error when trying to discount stock quantities" });
                    }

                    obtenerTrabajoMultiple({ idventa: idVenta }, response3 => {
                        if (response3.error) {
                            return callback({ error: 1, msg: "error fetching venta with trabajos" });
                        }
                        
                        callback({ ok: 1, data: response3 });
                    });


                });
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
    doAgregarTrabajoMultiple(trabajos, idsucursal, idventa, callback);
}

const doAgregarTrabajoMultiple = (trabajos, idsucursal, idventa, callback) => {
    if(!trabajos || trabajos.length == 0) {
        return callback({ msg: "no more trabajos to process" });
    }
    const trabajo = trabajos.shift();
    //console.log("trabajo a insertar: ", trabajo);
    db.agregarTrabajo(trabajo, idventa, response=>{
        db.agregarTabajoItems(trabajo, response.idtrabajo, idventa, idsucursal , response=>{
            if (response.error) {
                return callback({ error: 1, msg: "error inserting trabajo items" });
            }
            doAgregarTrabajoMultiple(trabajos, idsucursal, idventa, callback);
        })
    })
}

const descontarStock = (data, idsucursal, callback) => {
    return callback({ ok: 1 });
}

const controlarStock = (data, idsucursal, callback) => {
    return callback({ ok: 1 });//for now, we will not control stock quantities, but in the future we will implement this function to check if there is stock available for the products in the venta
    //check using db quantities
    db.checkQuantities(products_quantities, response => {
        callback(response);
    })
}


const obtenerTrabajoMultiple = (data, callback) => {
    db.obtenerTrabajoMultiple(data, response=>{
        const {venta, trabajos} = response;
        const ts = [];
        const venta1 = {...venta, trabajos: []};
        let cur_idtrabajo = -1;
        let cur_trabajo = null;
        trabajos.forEach(t => {
            if(t.idtrabajo!=cur_idtrabajo)
            {
                cur_idtrabajo = t.idtrabajo;
                cur_trabajo = {
                    idtrabajo: t.idtrabajo,
                    tipo: t.tipo_trabajo,
                    nro: t.nro_trabajo,
                    items: []
                };
                venta1.trabajos.push(cur_trabajo);
            }
            if(cur_idtrabajo)
            {
                cur_trabajo.items.push({
                    idcodigo: t.stock_codigo_idcodigo,
                    esf: t.esf,
                    cil: t.cil,
                    eje: t.eje,
                    tipo: t.tipo,
                    cantidad: t.cantidad,
                    precio: t.precio,
                    total: t.total,
                    iddescuento: t.id_descuento,
                })
            }
        });
        //console.log("venta con trabajos: ", venta1);
        callback?.(venta1);

    });
}

const obtenerListadoVentasTM = (callback) => {
    db.obtenerListadoVentasTM(response => {
        if (response.error) {
                return callback({ error: 1, msg: "error fetching ventas" });    
        }
        callback(response);
    });
}


const obtenerItemsTrabajo = (data, callback) => {
    db.obtenerItemsTrabajo(data, response => {
        if (response.error) {
                return callback({ error: 1, msg: "error fetching items for trabajo" });    
        }
        callback(response);
    });
}

module.exports = { procesarTrabajoMultiple, obtenerListadoVentasTM , obtenerTrabajoMultiple, obtenerItemsTrabajo}