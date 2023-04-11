const mysql_connection = require("../lib/mysql_connection");
const envio_queries = require("./queries/envioQueries");

const obtener_lista_envio_stock = (idenvio,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(envio_queries.queryListaEnvioStock(idenvio),
    (err,rows)=>{
        callback(rows)
    })
    connection.end();
}

module.exports = {
    obtener_lista_envio_stock,
}