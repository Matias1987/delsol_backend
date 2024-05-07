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

const obtener_items_operacion = (data, callback) => {
    const query = `SELECT vi.* FROM venta v ,
    (
        SELECT vhs.venta_idventa,vhs.tipo,vhs.esf, vhs.cil, vhs.eje, vhs.cantidad, vsp.idVtaStockPedido , c.codigo, c.descripcion
        FROM codigo c, 
        venta_has_stock vhs LEFT JOIN venta_stock_pedido vsp ON vsp.fkVentaItem = vhs.idventaitem
        WHERE 
        c.idcodigo = vhs.stock_codigo_idcodigo 
    ) AS vi
    WHERE 
    v.idventa = vi.venta_idventa AND
    v.idventa = ${data.idventa}
    ;`
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const obtener_lista_operaciones = (data,callback) => {
    const query = `SELECT 
    v.idventa,
    CONCAT(c.apellido,' ',c.nombre) AS 'cliente',
    u.nombre AS 'usuario',
    DATE_FORMAT(v.fecha_retiro,'%d-%m-%Y') AS 'fecha_retiro_f'
    FROM venta v, cliente c, usuario u 
    WHERE 
    v.estado='PENDIENTE' AND 
    v.estado_taller='${data.estado_taller}';`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()


}

module.exports = {obtener_items_operacion, obtener_lista_operaciones, marcar_como_calibrando, marcar_como_terminado, agregar_pedido}