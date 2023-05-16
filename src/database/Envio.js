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
    s.nombre AS 'sucursal'
    FROM envio e, sucursal s WHERE e.sucursal_idsucursal = s.idsucursal order by e.idenvio desc;`,
        (err,results)=>{
            console.log(JSON.stringify(results))
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
        cantidad_total)
        values (${data.sucursal_idsucursal},${data.usuario_idusuario},${data.cantidad_total})`
    
        console.log(_query)
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
            console.log("items: ", values)
            connection.query("INSERT INTO `envio_has_stock` (`envio_idenvio`, `codigo_idcodigo`,  `cantidad`) VALUES " + values + ";",
            values,
            
            (err,res)=>{
                console.error(err)
                callback(_eid);
            })
            connection.end();
        }
    );
    
}

const detalle_envio = (idenvio,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    console.log("getting details of envio: " + idenvio)
    connection.query(
        envio_queries.queryDetalleEnvio(idenvio),
        (err,results)=>{
            console.log(JSON.stringify(results))
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


module.exports = {
    agregar_envio,
    detalle_envio,
    lista_envios,
    obtenerEnvios,
}