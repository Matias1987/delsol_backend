const mysql_connection = require("../lib/mysql_connection")

const registrar_cambio_venta_item = (data, callback) => {
    const connection = mysql_connection.getConnection()
    const query = `INSERT INTO venta_has_stock (
                    venta_idventa, 
                    stock_sucursal_idsucursal, 
                    stock_codigo_idcodigo,
                    tipo,
                    esf, 
                    cil, 
                    eje, 
                    curva_base, 
                    diametro,
                    precio, 
                    total,
                    orden
                    )
                    VALUE(
                    ${connection.escape(data.idventa)},
                    ${connection.escape(data.idventa)},
                    ${connection.escape(data.idventa)},
                    ${connection.escape(data.idventa)},
                    ${connection.escape(data.idventa)},
                    ${connection.escape(data.idventa)},
                    ${connection.escape(data.idventa)},
                    ${connection.escape(data.idventa)},
                    ${connection.escape(data.idventa)},
                    ${connection.escape(data.idventa)},
                    ${connection.escape(data.idventa)},
                    ${connection.escape(data.idventa)},
                    )`

    const query1 = `UPDATE venta_has_stock vhs SET vhs.activo =${data.idventa} WHERE vhs.tipo='${data.idventa}' AND vhs.venta_idventa=${data.idventa};`



    connection.connect()

    connection.query(query, (err, response)=>{
        if(err)
        {
            console.log("Error trying to save cambio: " + err)
            return callback(-1)
        }

        callback(response)
    })

    connection.end()

}

module.exports = {registrar_cambio_venta_item}