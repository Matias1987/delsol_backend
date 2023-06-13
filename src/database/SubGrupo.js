const mysql_connection = require("../lib/mysql_connection")

const modificar_multiplicador_grupos = (categoria, id, value,incrementar, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    
    const _q = (incrementar == 1) ? `
                UPDATE subgrupo sg, grupo g, subfamilia sf 
                SET sg.multiplicador = if(sg.multiplicador = 0, TRUNCATE(${value},2),TRUNCATE(sg.multiplicador * ${value},2))
                WHERE 
                sg.grupo_idgrupo = g.idgrupo AND
                g.subfamilia_idsubfamilia = sf.idsubfamilia AND
                (case when '${categoria=="subgrupo"? id: ''}' <> '' then sg.idsubgrupo = '${categoria=="subgrupo"? id: ''}'  ELSE TRUE END) AND
                (case when '${categoria=="grupo"? id: ''}' <> '' then g.idgrupo = '${categoria=="grupo"? id: ''}' ELSE TRUE END) AND
                (case when '${categoria=="subfamilia"? id: ''}' <> '' then sf.idsubfamilia = '${categoria=="subfamilia"? id: ''}' ELSE TRUE END) AND 
                (case when '${categoria=="familia"? id: ''}' <> '' then sf.familia_idfamilia = '${categoria=="familia"? id: ''}' ELSE TRUE END);`
    :
    `
                UPDATE subgrupo sg, grupo g, subfamilia sf 
                SET sg.multiplicador = ${value}
                WHERE 
                sg.grupo_idgrupo = g.idgrupo AND
                g.subfamilia_idsubfamilia = sf.idsubfamilia AND
                (case when '${categoria=="subgrupo"? id: ''}' <> '' then sg.idsubgrupo = '${categoria=="subgrupo"? id: ''}'  ELSE TRUE END) AND
                (case when '${categoria=="grupo"? id: ''}' <> '' then g.idgrupo = '${categoria=="grupo"? id: ''}' ELSE TRUE END) AND
                (case when '${categoria=="subfamilia"? id: ''}' <> '' then sf.idsubfamilia = '${categoria=="subfamilia"? id: ''}' ELSE TRUE END) AND 
                (case when '${categoria=="familia"? id: ''}' <> '' then sf.familia_idfamilia = '${categoria=="familia"? id: ''}' ELSE TRUE END);`;

    console.log(_q);
    connection.query(_q,(err,data)=>{
        callback(data)
    });

    connection.end();

}

const obtener_subgrupos_bygrupo_opt = (grupoid,callback)=>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query("SELECT sg.idsubgrupo as 'value', sg.nombre_largo as 'label', sg.multiplicador FROM subgrupo sg WHERE sg.grupo_idgrupo="+grupoid+";",
    (err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const obtener_subgrupos = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`select CONCAT(f.nombre_corto , ' / ', sf.nombre_corto, '  / ', g.nombre_corto , ' / ') AS 'ruta', sg.* from subgrupo sg, grupo g, subfamilia sf, familia f WHERE
    sg.grupo_idgrupo = g.idgrupo AND g.subfamilia_idsubfamilia = sf.idsubfamilia AND
    sf.familia_idfamilia = f.idfamilia;`,(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_subgrupo = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(`select sg.idsubgrupo from subgrupo sg where sg.nombre_corto = '${data.nombre_corto}' and sg.grupo_idgrupo=${data.grupo_idgrupo}`,
    (err,rows)=>{
        if(rows.length>0){
            return callback(-1)
        }
        else{
            var sql = "insert into subgrupo (nombre_corto, nombre_largo,grupo_idgrupo, multiplicador) values (?)";

            var values = [[
                data.nombre_corto,
                data.nombre_largo,
                data.grupo_idgrupo,
                data.multiplicador,
            ]];
        
            connection.query(sql,values, (err,result) => {
                    return callback(result.insertId)
                });
        }

        connection.end();
    })

    
    
}

const obtener_detalle_subgrupo = (id,callback)=>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    const query = `SELECT sg.* FROM subgrupo sg WHERE sg.idsubgrupo=${id};`;
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end();
}

module.exports = {
    obtener_subgrupos,
    agregar_subgrupo,
    obtener_subgrupos_bygrupo_opt,
    modificar_multiplicador_grupos,
    obtener_detalle_subgrupo,
}
