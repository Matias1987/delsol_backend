const db = require("../database/StockCristales");

const guardar_stock_cristales = (data, callback) => {
    db.guardar_stock_cristales(data, (response) => {
        callback(response);
    })

}

const obtener_grilla = (data, callback) => {
    db.obtener_grilla(data, (response) => {
        callback(response)
    })

}

const obtener_stock = (data, callback) => {
    db.obtener_stock(data, (response) => {
        callback(response)
    })

}

const obtener_codigos_cristales = (callback) => {
    db.obtener_codigos_cristales(response => {
        callback(response)
    })
}

const check_stock_cristales = (data, callback) => {
    const addToArray = (parentObj, field, arr) => parentObj[field] ?
        [...arr, parentObj[field]] :
        arr;

    const updateCodeQttyArray = (obj, _array) => _array.find(record => record.idcodigo == obj.idcodigo && record.esf == obj.esf && record.cil == obj.cil) ?
        _array.map(_record => _record.idcodigo == obj.idcodigo && _record.esf == obj.esf && _record.cil == obj.cil ? { ..._record, cantidad: +_record.cantidad + +obj.cantidad } : _record)
        : [..._array, { idcodigo: obj.idcodigo, esf: obj.esf, cil: obj.cil, cantidad: obj.cantidad }]

    let arrayQtties = [];
    let elementsArr = [];
    elementsArr = addToArray(data.productos, "lejos_od", elementsArr);
    elementsArr = addToArray(data.productos, "lejos_oi", elementsArr);
    elementsArr = addToArray(data.productos, "cerca_oi", elementsArr);
    elementsArr = addToArray(data.productos, "cerca_od", elementsArr);

    elementsArr.forEach(element => {
        arrayQtties = updateCodeQttyArray(element, arrayQtties);
    });

    //example: {"idcodigo":300,"esf":"-0.25","cil":"-2.00","cantidad":2}
    db.obtener_stock({
        fk_sucursal: data.fk_sucursal, productos: arrayQtties
    },
    (response)=>{
        
    }
)

}


module.exports = { guardar_stock_cristales, obtener_grilla, obtener_stock, obtener_codigos_cristales }



