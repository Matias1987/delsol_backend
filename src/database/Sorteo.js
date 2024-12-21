const { get_uid } = require("../lib/helpers")
const mysql_connection = require("../lib/mysql_connection")
const sorteoQueries = require("./queries/sorteoQueries")

const generarSorteo = (data, callback) =>{

    console.log(JSON.stringify(data))

    //return

    const connection = mysql_connection.getConnection()

    const uid = get_uid(1)
    /**
     * generate sorteo
     */
    const query_insert_sorteo = `insert into sorteo.sorteo (uid, fecha, descripcion) values (${connection.escape(uid)},now(), '')`
    /**
     * generate tickets
     */
    const query_insert_tickets = `INSERT ignore INTO sorteo.ticket (participante_idparticipante,sorteo_idsorteo,uid) (
	SELECT 
	  v.cliente_idcliente,
	  '${connection.escape(uid)}',
	  v.idventa
	  FROM 
	  optica_online_final.venta v INNER JOIN 
	  (
	      SELECT DISTINCT  vhs.venta_idventa FROM 
	      optica_online_final.subfamilia sf, 
	      optica_online_final.grupo g, 
	      optica_online_final.subgrupo sg,
	      optica_online_final.codigo c,
	      optica_online_final.venta_has_stock vhs
	      WHERE
	      c.subgrupo_idsubgrupo = sg.idsubgrupo AND 
	      sg.grupo_idgrupo=g.idgrupo AND 
	      g.subfamilia_idsubfamilia = sf.idsubfamilia AND 
	      vhs.stock_codigo_idcodigo = c.idcodigo AND 
	      sf.familia_idfamilia <> 17	
	  ) vf ON vf.venta_idventa = v.idventa,
	  optica_online_final.cliente cl
	  WHERE 
	  cl.idcliente=v.cliente_idcliente AND 
	  MONTH(v.fecha) = 12 AND 
	  YEAR(v.fecha)=2024 AND  
	  v.estado = 'ENTREGADO' AND 
	  v.cliente_idcliente<>1 AND 
	  v.sucursal_idsucursal<>10 AND
	  v.sucursal_idsucursal<>15 
  )
  ;`

    console.log(query_insert_sorteo)
    
    console.log(query_insert_tickets)

    connection.connect()

    connection.query(query_insert_sorteo,(err, response)=>{

        if(err)
        {
            console.log("Error trying to create a new sorteo, " + err)
            return callback({msg:"Error " + err})
        }

        connection.query(query_insert_tickets,(err1,response1)=>{
            if(err1)
            {
                console.log("Error trying to generate tickets for a new sorteo, " + err1)
                return callback({msg:"Error " + err1})
            }
        })

        connection.end()

    })

}

const obtenerParticipantesDistinct = (data, callback)=>{
    const query = sorteoQueries.query_get_tickets()
    const connection = mysql_connection.getConnection()
    console.log(query)
    connection.connect()

    connection.query(query,(err,resp)=>{
        if(err)
        {
            console.log("Error trying to get tickets for sorteo")
        }
        return callback(resp)
    })

    connection.end()
}
const obtenerTickets = (data, callback)=>{
    const query = sorteoQueries.query_get_tickets
    const connection = mysql_connection.getConnection()

    connection.connect()

    connection.query(query,(err,resp)=>{
        if(err)
        {
            console.log("Error trying to get tickets for sorteo")
        }
    })
}

const determinarGanador = (data, callback) => {
    const connection = mysql_connection.getConnection()
 

    connection.connect()

    connection.query(sorteoQueries.query_get_tickets,
        (err,response)=>{
            if(err)
            {
                console.log("Error trying to get tickets for sorteo, " + err)
                return callback({msg:"ERROR"})
            }
            const tickets_arr = response||[]
            //determine the winner!
            const winner_index = Math.floor( Math.random() * tickets_arr.length)
            
            const the_winner = tickets_arr[winner_index]

            const set_winner_query = `update ticket t set t.ganador=1 where t.sorteo_idsorteo=${data.uidsorteo} and t.uid=${connection.escape(the_winner.idventa)}`

            connection.query(set_winner_query,(_err,_response)=>{
                if(_err)
                {
                    console.log("Error trying to set winner, " + _err)
                    return callback({msg:"ERROR " + _err})
                }
                return callback({winner_id: the_winner.cliente_idcliente})
            })

            connection.end()

        }
    )

    
}

const obtenerSorteo = (data, callback) => {

}

module.exports = {generarSorteo, obtenerParticipantesDistinct, determinarGanador, obtenerSorteo, obtenerTickets}