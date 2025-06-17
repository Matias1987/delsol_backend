//get connection with mysql
const mysql_connection = require("../lib/mysql_connection")

const obtener_grupos = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("select g.*, concat(f.nombre_corto,' / ',sf.nombre_corto, ' / ') as 'ruta' from grupo g, subfamilia sf, familia f where f.idfamilia = sf.familia_idfamilia and sf.idsubfamilia = g.subfamilia_idsubfamilia order by g.nombre_largo asc;",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_grupos_bysubfamilia_opt = (data, callback) =>{
    const {idsubfamilia, visible} = data;
    
    const connection = mysql_connection.getConnection();
    connection.connect();
    const query = `SELECT 
                    g.idgrupo as 'value', 
                    g.nombre_largo as 'label' ,
                    if(sg.grupo_idgrupo is null, 0, sg.qtty) AS 'subgrupo_qtty'
                    FROM grupo g left join
                    (SELECT _sg.grupo_idgrupo, COUNT(*) AS 'qtty' FROM subgrupo _sg GROUP BY _sg.grupo_idgrupo) sg 
                    on sg.grupo_idgrupo = g.idgrupo 
                    WHERE 
                    (case when '${(visible||"0")}'='0' then true else g.visible_lp=1 end) and
                    g.subfamilia_idsubfamilia=${idsubfamilia}  
                    order by g.nombre_largo ASC
                    ;`
    console.log(query)
    connection.query(query,
                    
    (err,rows,fields)=>{
        //console.log(JSON.stringify(rows))
        return callback(rows);
    });
    connection.end();
}

const agregar_grupo = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(`SELECT g.idgrupo FROM grupo g WHERE g.subfamilia_idsubfamilia = ${connection.escape(data.subfamilia_idsubfamilia)} AND g.nombre_corto=${connection.escape(data.nombre_corto)}`,
    (err,rows)=>{
        if(rows.length>0){
            return callback(-1);
        }
        else{
            var sql = "insert into grupo (nombre_corto, nombre_largo,subfamilia_idsubfamilia) values (?)";

            var values = [[
                data.nombre_corto,
                data.nombre_largo,
                data.subfamilia_idsubfamilia
            ]];
        
            connection.query(sql,values, (err,result) => {
                    return callback(result.insertId)
                });
        }

        connection.end();
    }
    )

    
    
}

const mover = (data,callback) => {

    const query = `update grupo g set g.subfamilia_idsubfamilia=${data.targetId} where g.idgrupo in = (${data.ids.map(g=>g)})`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

module.exports = {
    mover,
    obtener_grupos,
    agregar_grupo,
    obtener_grupos_bysubfamilia_opt,
}

