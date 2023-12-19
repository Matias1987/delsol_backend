const mysql_connection = require("../lib/mysql_connection")

const obtener_subgrupos_grupo = (idsubfamilia,callback)=>{
    const q = `SELECT g.nombre_corto AS 'grupo', 
    sg.nombre_largo AS 'subgrupo', 
    sg.precio_defecto AS 'precio', 
    sg.idsubgrupo, 
    g.idgrupo 
    FROM subgrupo sg, grupo g WHERE 
    sg.grupo_idgrupo=g.idgrupo and
    g.subfamilia_idsubfamilia=${idsubfamilia} 
    ORDER BY 
    sg.grupo_idgrupo;`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(q,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const modificar_precios_defecto = (data,callback) => {
    if(
        data.idfamilia<0 &&
        data.idsubfamilia<0 &&
        data.idgrupo<0 &&
        data.idsubgrupo<0
        )
        {
            /* ERROR */
            console.log("ERROR, AL VALUES ARE LESS THAN 1. FILTER REQUIRED")
            return;
        }
    const connection = mysql_connection.getConnection()
    connection.connect()

    const query = `update
    subgrupo sg,
    grupo g,
    subfamilia sf, 
    familia f
    SET sg.precio_defecto = (sg.precio_defecto * ${parseFloat(data.multiplicador)} ) + ${parseFloat(data.valor)}
    WHERE 
    sg.grupo_idgrupo=g.idgrupo AND
    g.subfamilia_idsubfamilia = sf.idsubfamilia AND
    sf.familia_idfamilia = f.idfamilia AND
    (case when '-1' <> '${data.idfamilia}' then f.idfamilia = ${data.idfamilia} ELSE TRUE END) AND 
    (case when '-1' <> '${data.idsubfamilia}' then sf.idsubfamilia = ${data.idsubfamilia} ELSE TRUE END) AND 
    (case when '-1' <> '${data.idgrupo}' then g.idgrupo = ${data.idgrupo} ELSE TRUE END) AND 
    (case when '-1' <> '${data.idsubgrupo}' then sg.idsubgrupo = ${data.idsubgrupo} ELSE TRUE END);`


    connection.query(query,(err,resp)=>{
        callback(resp)
    })

    connection.end()

}

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
    console.log(JSON.stringify(data))
    const connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(`select sg.idsubgrupo from subgrupo sg where sg.nombre_corto = '${data.nombre_corto}' and sg.grupo_idgrupo=${data.grupo_idgrupo}`,
    (err,rows)=>{
        if(rows.length>0){
            return callback(-1)
        }
        else{
            var sql = `insert into subgrupo (nombre_corto, nombre_largo,grupo_idgrupo, multiplicador, precio_defecto, no_stock) values (
                '${data.nombre_corto}','${data.nombre_largo}',${data.grupo_idgrupo},${data.multiplicador},${data.precio_defecto},${+data.control_stock==0 ? 1 : 0}
            )`;

            /*var values = [[
                data.nombre_corto,
                data.nombre_largo,
                data.grupo_idgrupo,
                data.multiplicador,
                data.precio_defecto,
            ]];*/
            console.log(sql)
            connection.query(sql, (err,result) => {
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

const obtener_descripcion_cat_subgrupo = (id,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    const query = `select * from detalle_categoria dc where  dc.fkcategoria=${id};`;
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
    modificar_precios_defecto,
    obtener_descripcion_cat_subgrupo,
    obtener_subgrupos_grupo,
}
