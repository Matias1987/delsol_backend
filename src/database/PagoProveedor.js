const mysql_connection = require("../lib/mysql_connection")

const agregar_pago_proveedor = (data,callback) => {

    console.log('data pago proveedor:',JSON.stringify(data));

    const connection = mysql_connection.getConnection()

    connection.connect()

     const query_pago = `INSERT INTO pago_proveedor (fk_proveedor, monto) VALUES (${connection.escape(data.fk_proveedor)}, ${connection.escape(data.monto)});`

    connection.query(query_pago,(err,resp)=>{

        //go thru mp
        let mp=''
        data.mp.forEach(mp=>{
            mp+= (mp.length>0?',':'') +`(${connection.escape(mp.modo_pago)},${connection.escape(resp.inserId)},${connection.escape(mp.monto)},${connection.escape(mp.fkcta_bancaria)})`
        })

        const query_modo = `INSERT INTO pago_proveedor_modo (modo_pago, fk_pago_proveedor, monto, fk_cuenta_bancaria) VALUES ${mp};`
        console.log(query_modo);
        connection.query(query_modo,(_resp)=>{
            callback(_resp)
        })

        connection.end()

    })

}

const lista_pago_proveedor = (data, callback) => {

}

const anular_pago_proveedor = (data,callback) => {

}

const detalle_pago_proveedor = (data, callback) => {

}

module.exports = {
    agregar_pago_proveedor,
    anular_pago_proveedor,
    lista_pago_proveedor,
    detalle_pago_proveedor,
}