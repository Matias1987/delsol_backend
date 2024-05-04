const mysql_connection = require("../lib/mysql_connection");

const agregar_pedido =  (data,callback) => {
    /**
     * idcodigo
     * idventaitem
     * estado
     */
    const query = `INSERT INTO venta_stock_pedido (fkVentaItem, fkSucursalPedido) VALUES ;`;

    //CALLBACK
    let values=``
    data.items.forEach(i=>{
        values += (values.length>1 ? ',':'') + `(${i.idventaitem},${data.fksucursalpedido})`;
    })  

    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query + values,(err,resp)=>{
        callback(resp)
    })
    connection.end()


}

const marcar_como_calibrando = (data,callback) => {
    const query =  `update venta v set v.estado_taller='CALIBRADO' where v.idventa = ${data.idventa}`;
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query, (err,resp)=>{
        callback(resp)
    })
    connection.end();
}

const marcar_como_terminado = (data,callback) => {
    const query =  `update venta v set v.estado_taller='TERMINADO', v.en_laboratorio='0' where v.idventa = ${data.idventa}`;
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query, (err,resp)=>{
        callback(resp)
    })
    connection.end();
}

const obtener_lista = (data,callback) => {
    const query = `select * from venta_stock_pedido`


}

module.exports = {marcar_como_calibrando, marcar_como_terminado, agregar_pedido, obtener_lista}