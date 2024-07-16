const mysql_connection = require("../lib/mysql_connection")

const agregar_pago_proveedor = (data,callback) => {

    const connection = mysql_connection.getConnection()

    connection.connect()

     const query_pago = `INSERT INTO pago_proveedor (fk_proveedor, monto) VALUES (${data.fk_proveedor}, ${data.monto});`

    connection.query(query_pago,(err,resp)=>{

        //go thru mp
        let mp=''
        data.mp.forEach(mp=>{
            mp+= (mp.length>0?',':'') +`('${mp.modo_pago}',${resp.inserId},${mp.monto})`
        })

        const query_modo = `INSERT INTO pago_proveedor_modo (modo_pago, fk_pago_proveedor, monto) VALUES ${mp};`
        
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