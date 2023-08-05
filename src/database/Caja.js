const mysql_connection = require("../lib/mysql_connection");

const cerrarCaja = (idcaja, callback) => {
    const connection = mysql_connection.getConnection();

    connection.connect();

    connection.query(`UPDATE caja c SET c.estado='CERRADO' WHERE c.idcaja=${idcaja}`,(err,resp)=>{
        callback(resp)
    })

    connection.end();
}

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
    const sql = `SELECT c.*, date_format(c.fecha, '%d-%m-%Y') as 'fecha_f' FROM caja c WHERE c.sucursal_idsucursal=${idsucursal} AND c.estado='ABIERTA';`;
    connection.query(sql,(err,rows)=>{
        
        if(rows.length>0)
        {
            console.log(JSON.stringify(rows))
            callback({...rows[0],status:'OK'})
        }
        else{
            callback({message:'error, no se encontro', status: 'error'})
        }
        
    })
    connection.end();
}

module.exports = {agregarCaja,obtener_caja,cerrarCaja,}