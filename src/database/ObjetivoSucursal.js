const mysql_connection = require("../lib/mysql_connection")

const obtener_objetivo_sucursal = (data, callback) => {
    const connection = mysql_connection.getConnection()

    const query = `
                    SELECT s.nombre, os.monto, os.fecha_creacion, os.id_objetivo_sucursal, os.fk_sucursal FROM 
                    (
                        SELECT * FROM objetivo_sucursal os1 
                        WHERE os1.id_objetivo_sucursal IN 
                        ( 
                            SELECT MAX(_os.id_objetivo_sucursal) 
                            FROM objetivo_sucursal _os 
                            GROUP by _os.fk_sucursal
                        ) 
                    )os  
                    INNER JOIN sucursal s ON s.idsucursal = os.fk_sucursal 
                    WHERE
                    (case when ''<>'${connection.escape(data.idsucursal)}' then os.fk_sucursal = ${connection.escape(data.idsucursal)} ELSE TRUE END )
                    ;`

    connection.connect()

    connection.query(query,(err,response)=>{
        if(err)
        {
            return callback({err:1})
        }

        callback(response)
    })

    connection.end()
}

const establecer_objetivo_sucursal = (data, callback) => {
    const connection = mysql_connection.getConnection()
    const query = `INSERT INTO objetivo_sucursal (fk_sucursal, monto) VALUES (${connection.escape(data.idsucursal)},${connection.escape(data.monto)});`
    connection.connect();

    connection.query(query,(err,response)=>{
        callback(response)
    })
    connection.end()
}

const obtener_progreso_sucursal_objetivo = (data, callback) => {
    const connection = mysql_connection.getConnection()

    const query = `SELECT * from
                    (
                        SELECT 
                        0 AS 'id',
                        'v'AS  'tipo',
                        SUM(v.monto_total) AS 'monto'
                        FROM venta v 
                        WHERE 
                        v.sucursal_idsucursal=8 AND  
                        v.estado='ENTREGADO' AND 
                        MONTH(v.fecha_retiro) = ${connection.escape(data.mes)} AND
                        YEAR(v.fecha_retiro)= ${connection.escape(data.anio)}
                        
                        UNION 
                        
                        SELECT * FROM
                        (
                            SELECT ob.id_objetivo_sucursal AS 'id', 
                            'o' AS 'tipo', 
                            ob.monto 
                            FROM objetivo_sucursal ob 
                            WHERE ob.fk_sucursal=${connection.escape(data.fksucursal)} 
                            ORDER BY ob.id_objetivo_sucursal DESC LIMIT 1
                        )_
                        
                    )__;`

    console.log(query)
    connection.connect()

    connection.query(query,(err,response)=>{
        if(err)
        {
            return callback({err:1})
        }

        callback(response)
    })

    connection.end()
}


module.exports = {
    obtener_objetivo_sucursal,
    obtener_progreso_sucursal_objetivo,
    establecer_objetivo_sucursal,
}