const mysql_connection = require("../lib/mysql_connection")

const search_codigos = (data, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        `SELECT c.idcodigo,c.codigo,c.descripcion FROM codigo c WHERE c.codigo LIKE '%${data}%' OR c.descripcion LIKE '%${data}%';`
        ,(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_codigo_por_id = (idcodigo,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`select * from codigo where idcodigo=${idcodigo}`,(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_codigo = (idcodigo,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`select * from codigo c where  c.codigo='${idcodigo}'`,(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_codigos = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select * from codigo",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_codigo = (data,callback) => {
    const _genero = typeof data.genero === 'undefined' ? '' : data.genero;
    const _edad = typeof data.edad === 'undefined' ? '' : data.edad;
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = `insert ignore into codigo (
        codigo, 
        descripcion,
        subgrupo_idsubgrupo,
        genero,
        edad
        ) values ('${data.codigo}', '${data.descripcion}', ${data.subgrupo_idsubgrupo},'${_genero}','${_edad}')`;

    console.log(sql)

    connection.query(sql, (err,result) => {
        
            if(err!=null){
                return callback(-1)
            }else{
                const _id = typeof result === 'undefined' ? -1 : result.insertId;
                return callback(_id)
            }
        
            
        });
    connection.end();
}

const obtener_codigos_bysubgrupo_opt = (idsubgrupo,callback) =>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("SELECT c.idcodigo AS 'value', c.codigo AS 'label' FROM codigo c WHERE c.subgrupo_idsubgrupo = "+idsubgrupo+";",(err,rows,fields)=>{
        return callback(rows);
    });
    connection.end();
}

module.exports = {
    obtener_codigos,
    agregar_codigo,
    obtener_codigos_bysubgrupo_opt,
    search_codigos,
    obtener_codigo_por_id,
    obtener_codigo,
}
