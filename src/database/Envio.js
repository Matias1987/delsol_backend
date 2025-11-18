const mysql_connection = require("../lib/mysql_connection");

const envio_queries = require("./queries/envioQueries");

const obtenerEnvios = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`SELECT 
    e.sucursal_idsucursal,
    DATE_FORMAT(e.fecha, '%d-%m-%y') AS 'fecha', 
    e.cantidad_total,
    e.idenvio,
    s.nombre AS 'sucursal',
    s1.nombre AS 'origen',
    e.estado
    FROM envio e, sucursal s, sucursal s1 WHERE 
	 e.sucursal_idsucursal = s.idsucursal AND 
	 e.sucursal_origen = s1.idsucursal
	 order by e.idenvio desc;`,
        (err,results)=>{
            //console.log(JSON.stringify(results))
            return callback(results);
        }
    );
    connection.end();
}

const agregar_envio = (data,callback) => {
    var _eid=-1;
    const connection = mysql_connection.getConnection();
    connection.connect();
    let _query = `insert into envio (
        sucursal_idsucursal,
        usuario_idusuario,
        cantidad_total,
        sucursal_origen
    )
        values (${data.sucursal_idsucursal},${data.usuario_idusuario},${data.cantidad_total},${data.id_sucursal_origen})`
    
        //console.log(_query)
        connection.query(
        _query
            ,
        (err,results)=>{
            
            if(err){
                console.error(err)
                throw err;
            }
            _eid = results.insertId;
            let values = "";
            data.items.forEach(element => {
                values+= (values==""? "" : ",") + "("+results.insertId + "," + element.codigo_idcodigo + "," + element.cantidad+")"
            });
            //console.log("items: ", values)
            connection.query("INSERT INTO `envio_has_stock` (`envio_idenvio`, `codigo_idcodigo`,  `cantidad`) VALUES " + values + ";",
            values,
            
            (err,res)=>{

                //console.error(err)

                //descontar cantidades


                connection.query(`UPDATE 
                stock s, 
                envio_has_stock ehs,
                envio e
                SET 
                s.cantidad = s.cantidad - ehs.cantidad
                WHERE
                e.idenvio = ehs.envio_idenvio AND  
                s.codigo_idcodigo = ehs.codigo_idcodigo AND
                s.sucursal_idsucursal = ${data.id_sucursal_origen} AND 
                ehs.envio_idenvio=${_eid} 
                ;`, (err,_resp)=>{
                    callback(_eid);
                })

                connection.end();
            })
            
        }
    );
    
}

const detalle_envio = (idenvio,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    //console.log("getting details of envio: " + idenvio)
    //console.log(envio_queries.queryDetalleEnvio(idenvio))
    connection.query(
        envio_queries.queryDetalleEnvio(idenvio),
        (err,results)=>{
           // console.log(JSON.stringify(results))
            return callback(results);
        }
    );
    connection.end();
}

const lista_envios = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        envio_queries.queryListaEnvios(),
        (err,results)=>{
            return callback(results);
        }
    );
    connection.end();
}

const obtener_envios_codigo = (idcodigo,callback) => {
    const query = `SELECT ehs.envio_idenvio AS 'nroenvio', ehs.cantidad , s.nombre as 'sucursal'
    FROM envio_has_stock ehs, sucursal s, envio e WHERE ehs.codigo_idcodigo = ${idcodigo} and ehs.envio_idenvio = e.idenvio and e.sucursal_idsucursal = s.idsucursal ;`;
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        query,
        (err,results)=>{
            return callback(results);
        }
    );
    connection.end();
}

const obtener_envios_pendientes_sucursal = (idsucursal, callback) => {
    const query = `SELECT e.idenvio, e.cantidad_total , DATE_FORMAT(e.fecha, '%d-%m-%Y')  as 'fecha' 
    FROM envio e WHERE e.sucursal_idsucursal=${idsucursal} AND e.estado<>'INGRESADO' and e.anulado<>1;`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end();
}
//cargar envio en la sucursal destino
const cargarEnvio = (idenvio, idsucursal, callback) =>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`select e.idenvio from envio e where e.idenvio=${idenvio} and e.estado='GENERADO'`,(err,_resp)=>{
        if(_resp.length<1)
        {
            callback(_resp);
            //ERROR, INSER EVENT ABOUT WHAT HAPPENED
            connection.query(`INSERT INTO evento ( detalle, fk_usuario, fk_sucursal, ref_id, tipo)  VALUES ( 'ERROR CARGAR ENVIO',NULL, ${idsucursal}, ${idenvio}, 'ENVIO ERROR');`)

            connection.end()
            return
        }
        connection.query(`INSERT ignore INTO stock (codigo_idcodigo,sucursal_idsucursal,cantidad)
        ( SELECT ehs.codigo_idcodigo, ${idsucursal} , 0 FROM envio_has_stock ehs WHERE ehs.envio_idenvio =${idenvio} ) `,
        (err,resp)=>{
            /*console.log(`UPDATE stock s, envio_has_stock ehs SET s.cantidad = s.cantidad + ehs.cantidad
            WHERE s.sucursal_idsucursal = ${idsucursal} ehs.codigo_idcodigo = s.codigo_idcodigo AND ehs.envio_idenvio = ${idenvio};`)*/


            connection.query(`UPDATE stock s, envio_has_stock ehs SET s.cantidad = s.cantidad + ehs.cantidad
            WHERE s.sucursal_idsucursal = ${idsucursal} AND ehs.codigo_idcodigo = s.codigo_idcodigo AND ehs.envio_idenvio = ${idenvio};`, (err,resp)=>{
                callback(resp);
                connection.query(`update envio e set e.estado = 'INGRESADO' where e.idenvio = ${idenvio};`)
                connection.end();
            })
            
        })

        
    })
    
}

const anular_envio = (idenvio, callback) => {
    // 
    const connection = mysql_connection.getConnection()
    connection.connect()
    //console.log(`select e.estado from envio e where e.idenvio=${idenvio};`)
    //console.log(`update envio e set e.anulado = 1, e.estado='ANULADO' where e.idenvio=${idenvio}`);
    connection.query(`select e.estado, e.sucursal_origen from envio e where e.idenvio=${idenvio};`,(err,rows)=>{
        if(rows.length>0)
        {
            if(rows[0].estado=='GENERADO')
            {
                connection.query(`update envio e set e.anulado = 1, e.estado='ANULADO' where e.idenvio=${idenvio};`,(err,resp)=>{
                    //callback(resp)
                })

                connection.query(`UPDATE stock s, envio_has_stock ehs SET s.cantidad = s.cantidad + ehs.cantidad
                WHERE s.sucursal_idsucursal = ${rows[0].sucursal_origen} AND ehs.codigo_idcodigo = s.codigo_idcodigo AND ehs.envio_idenvio = ${idenvio};`, (err,resp)=>{
                    callback(resp);
                })
            }
        }
        else{
            callback({msg:"error - estado incorrecto", status:"error"})
        }

        connection.end()

    })

}


const search_stock_envio = (data, callback) => {
    const tags =( data.tags.length>0 ? data.tags : [`'-'`]).map(t=>`'${t}'`)
    //const tags = typeof data.tags === 'undefined' ? [] : data.tags
    const tags_count = data.tags.length-1

    const q_local = data.conStockOrigen ? ' s1.cantidad>0 ':' true '
    const q_dest = data.sinStockDestino ? ' s.cantidad<1 ':' true '

    const query = `
                SELECT 
                f.nombre_largo AS 'familia',
                sf.nombre_largo AS 'subfamilia',
                g.nombre_largo AS 'grupo',
                sg.nombre_largo AS 'subgrupo',
                c.codigo, 
                c.descripcion, 
                c.cantidad,
                c.idcodigo,
                if(s.cantidad IS NULL, 0 , s.cantidad) AS 'cantidad_destino'
                FROM 
                subgrupo sg, 
                grupo g,
                subfamilia sf, 
                familia f,
                (SELECT _c.codigo, _c.descripcion, s1.cantidad, _c.idcodigo, _c.subgrupo_idsubgrupo  FROM codigo _c INNER JOIN stock s1 ON s1.codigo_idcodigo = _c.idcodigo AND s1.sucursal_idsucursal=${data.sucursal_origen} and ${q_local}) c
                LEFT JOIN stock s ON s.codigo_idcodigo=c.idcodigo AND s.sucursal_idsucursal=${data.sucursal_destino} and ${q_dest}
                WHERE 
                (
                    case when ${data.tags.length}<1 then TRUE ELSE 
                        c.idcodigo IN 
                        (
                            SELECT m.fk_codigo FROM (
                                SELECT COUNT(cht.fk_etiqueta) AS 'cnt', cht.fk_codigo 
                                FROM codigo_has_tag cht 
                                WHERE cht.fk_etiqueta IN (${tags}) GROUP BY cht.fk_codigo 
                            ) m WHERE m.cnt > ${tags_count}
                        )
                    end
                )
                AND 
                c.subgrupo_idsubgrupo = sg.idsubgrupo AND 
                sg.grupo_idgrupo = g.idgrupo AND 
                g.subfamilia_idsubfamilia = sf.idsubfamilia AND 
                sf.familia_idfamilia = f.idfamilia AND 
                (case when '${data.filtro}'<>'-1' then c.codigo like '%${data.filtro}%' else true end) AND 
                (case when '${data.idsubfamilia}'<>'-1' then sf.idsubfamilia=${data.idsubfamilia} ELSE TRUE END ) AND 
                (case when '${data.idfamilia}'<>'-1' then f.idfamilia=${data.idfamilia} ELSE TRUE END ) AND 
                (case when '${data.idsubgrupo}'<>'-1' then c.subgrupo_idsubgrupo=${data.idsubgrupo} ELSE TRUE END) AND 
                (case when '${data.idgrupo}'<>'-1' then sg.grupo_idgrupo=${data.idgrupo} ELSE TRUE END )
                ;
                `
                //console.log(query)
                const connection = mysql_connection.getConnection()
                connection.connect()
                connection.query(query,(err,resp)=>{
                    //console.log(JSON.stringify(resp))
                    callback(resp)
                })
                connection.end()
}

module.exports = {
    search_stock_envio,
    anular_envio,
    cargarEnvio,
    obtener_envios_pendientes_sucursal,
    agregar_envio,
    detalle_envio,
    lista_envios,
    obtenerEnvios,
    obtener_envios_codigo,
}