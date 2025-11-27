const mysql_connection = require("../lib/mysql_connection");

const agregar_pedido =  (data,callback) => {
    /**
     * idcodigo
     * idventaitem
     * estado
     */

    if(data.items.length<1)
    {
        callback({data:"ERR"})   
        return 
    }

    const query = `INSERT INTO venta_stock_pedido (fkSucursalPedido, fkcodigo, fkventa, tipo  ) VALUES `;

    //CALLBACK
    let values=``
    data.items.forEach(i=>{
        values += (values.length>1 ? ',':'') + `(${data.fksucursalpedido},${i.fkcodigo},${data.fkventa},'${i.tipo}')`;
    })  

    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query + values,(err,resp)=>{
        
        connection.query( `update venta v set v.estado_taller='PEDIDO' where v.idventa = ${data.fkventa}`,(err,resp)=>{
            callback(resp)
        })
            
        connection.end()
    })
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
    const query = `SELECT 
	c.idcodigo,
	c.codigo,
	vsp.fechaAlta,
	vsp.tipo,
	vsp.estado,
	vsp.cantidad
 FROM 
venta_stock_pedido vsp INNER JOIN 
codigo c ON c.idcodigo = vsp.fkcodigo
WHERE 
vsp.fkventa = ${data.idventa};


    ;`
   // console.log(query)
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

const marcar_como_laboratorio = (data,callback) => {
    const query =  `update venta v set v.estado_taller='LAB' where v.idventa = ${data.idventa}`;
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query, (err,resp)=>{
        callback(resp)
    })
    connection.end();
}

module.exports = {obtener_items_operacion, obtener_lista_operaciones, marcar_como_calibrando, marcar_como_terminado, agregar_pedido, marcar_como_laboratorio}