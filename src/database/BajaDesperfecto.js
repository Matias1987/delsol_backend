const mysql_connection = require("../lib/mysql_connection")

const obtener_lista = (callback)=>{
    const connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(`SELECT 
    DATE_FORMAT(bd.fecha,'%d-%m-%Y') AS 'fecha',
    bd.cantidad,
    bd.comentarios,
    u.nombre AS 'usuario',
    s.nombre AS 'sucursal',
    c.codigo
     FROM baja_desperfecto bd, usuario u, sucursal s, codigo c WHERE
    bd.fkcodigo = c.idcodigo AND
    bd.fksucursal = s.idsucursal AND
    bd.fkusuario = u.idusuario 
    ORDER BY bd.idbaja_desperfecto desc; `,(err,rows)=>{
        callback(rows)
    })
    connection.end();
}

const agregarBajaDesperfecto = (_data, callback) => {

    

    const connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(`SELECT c.idcodigo FROM codigo c WHERE c.codigo = '${_data.fkcodigo}'`,(error,_resp)=>{

        if(_resp.length>0){
            const data = {
                fkcodigo: _data.fkcodigo,
                fksucursal: _data.fksucursal,
                fkusuario: _data.fkusuario,
                cantidad: _data.cantidad,
                comentarios: _data.comentarios,
            }
    
            const query = `INSERT INTO baja_desperfecto (fkcodigo, fksucursal, fkusuario, cantidad, comentarios) 
            VALUES ('${_resp[0].idcodigo}', ${data.fksucursal}, ${data.fkusuario}, ${data.cantidad}, '${data.comentarios}');`;
            //console.log(query)
    
            connection.query(query,(err,response)=>{
                callback(1);
            })

        }
        else{
            //code not found
            callback(-1)
        }
        connection.end();
       
    })

    

    

}

    module.exports = {agregarBajaDesperfecto,obtener_lista,}