const mysql_connection = require("../lib/mysql_connection")

const modificar_multiplicador_grupos = (categoria, id, value, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    const _q = `
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
    connection.query("select * from subgrupo",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_subgrupo = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = "insert into subgrupo (nombre_corto, nombre_largo,grupo_idgrupo) values (?)";

    var values = [[
        data.nombre_corto,
        data.nombre_largo,
        data.grupo_idgrupo
    ]];

    connection.query(sql,values, (err,result) => {
            return callback(result.insertId)
        });
    connection.end();
}

module.exports = {
    obtener_subgrupos,
    agregar_subgrupo,
    obtener_subgrupos_bygrupo_opt,
    modificar_multiplicador_grupos,
}
