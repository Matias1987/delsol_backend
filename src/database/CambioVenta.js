const mysql_connection = require("../lib/mysql_connection")

const registrar_cambio_venta_item = (data, callback) => {
    const connection = mysql_connection.getConnection()
    const query = ``

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