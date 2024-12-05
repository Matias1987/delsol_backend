const mysql_connection = require("../lib/mysql_connection")

const registrar_cambio_venta_item = (data, callback) => {
    const connection = mysql_connection.getConnection()
    console.log(JSON.stringify(connection.config.database))
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
                    VALUES(
                    ${connection.escape(data.idventa)},
                    ${connection.escape(data.idsucursal)},
                    ${connection.escape(data.idcodigo)},
                    ${connection.escape(data.tipo)},
                    ${connection.escape(data.esf)},
                    ${connection.escape(data.cil)},
                    ${connection.escape(data.eje)},
                    ${connection.escape(data.cb)},
                    ${connection.escape(data.diam)},
                    ${connection.escape(data.precio)},
                    ${connection.escape(data.precio)},
                    ${connection.escape(1)}
                    );`

   // const query1 = `UPDATE venta_has_stock vhs SET vhs.activo =${data.idventa} WHERE vhs.tipo='${data.idventa}' AND vhs.venta_idventa=${data.idventa};`
    const query1 = `DELETE FROM venta_has_stock vhs WHERE vhs.venta_idventa=${data.idventa} AND vhs.tipo='${data.tipo}';`
    console.log(query)

    connection.connect()

    connection.query(query1, (err, response)=>{
        if(err)
        {
            console.log("Error trying to save cambio: " + err)
            connection.end()    
            return callback({msg:"Error " + err})
        }

        

        connection.query(query,(_err, _response)=>{
            if(_err)
            {
                return callback({msg:"Error " + _err})
            }
            return callback({msg:"OK"})
        })

        connection.end()    
    })

    

}

module.exports = {registrar_cambio_venta_item}