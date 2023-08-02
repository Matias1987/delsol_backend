const mysql_connection = require("../lib/mysql_connection");

const agregarCaja = (data,callback) =>
{
    const connection = mysql_connection.getConnection();

    connection.connect();

    const sql = "insert into caja (sucursal_idsucursal,monto_inicial,estado) values (?)"
    values = [[data.sucursal_idsucursal, data.monto_inicial, "ABIERTA"]];


    connection.query(sql,values,(err,result,fields)=>{
        return callback(result.insertId);
    })

    connection.end();
}

const obtener_caja = (idsucursal, callback) =>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = ``;
    connection.query(sql,(err,rows)=>{
        if(rows.length<1)
        {
            callback({...rows[0],status:'ok'})
        }
        else{
            callback({message:'error, no se encontro', status: 'error'})
        }
        
    })
    connection.end();
}

module.exports = {agregarCaja,obtener_caja,}