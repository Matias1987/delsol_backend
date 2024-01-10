const mysql_connection = require("../lib/mysql_connection")

const obtener_codigos_filtros = (data, callback) => {
    const query = `SELECT c.*, sg.precio_defecto FROM 
    codigo c, subgrupo sg, grupo g, subfamilia sf
    WHERE
    c.subgrupo_idsubgrupo=sg.idsubgrupo AND 
    sg.grupo_idgrupo = g.idgrupo AND 
    g.subfamilia_idsubfamilia = sf.idsubfamilia AND
    (case when '${data.codigo}'='' then TRUE ELSE c.codigo LIKE '%${data.codigo}%' END ) AND 
    (case when '${data.idsubgrupo}'='-1' then TRUE ELSE sg.idsubgrupo='${data.idsubgrupo}' END ) AND 
    (case when '${data.idgrupo}'='-1' then TRUE ELSE g.idgrupo='${data.idgrupo}' END ) AND 
    (case when '${data.idsubfamilia}'='-1' then TRUE ELSE sf.idsubfamilia='${data.idsubfamilia}' END ) AND
    (case when '${data.idfamilia}'='-1' then TRUE ELSE sf.familia_idfamilia='${data.idfamilia}' END )
    ;`
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

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
    connection.query("SELECT c.*, sg.multiplicador from codigo c, subgrupo sg WHERE c.subgrupo_idsubgrupo = sg.idsubgrupo;",(err,rows,fields)=>{
        return callback(rows);
    })
    connection.end();
}

const agregar_codigo = (data,callback) => {
    console.log("SAVING..........")
    console.log(JSON.stringify(data))

    var _genero = typeof data.genero === 'undefined' ? '' : data.genero;
    var _edad = typeof data.edad === 'undefined' ? '' : data.edad;
    var _costo = typeof data.costo === 'undefined' ? 0 : data.costo;
    _genero = _genero == null ? '':_genero;
    _edad = _edad == null ? '': _edad;
    _costo = _costo == null ? '': _costo;

    var esf = typeof data.esf === 'undefined' ? '' : data.esf;  
    var cil = typeof data.cil === 'undefined' ? '' : data.cil;
    var ad = typeof data.ad === 'undefined' ? '' : data.ad;

    const connection = mysql_connection.getConnection();
    connection.connect();
    var sql = `insert ignore into codigo (
        codigo, 
        descripcion,
        subgrupo_idsubgrupo,
        genero,
        edad,
        costo,
        modo_precio,
        precio,
        esf,
        cil,
        ad
        ) values (
        '${data.codigo}', 
        '${data.descripcion}', 
        ${data.subgrupo_idsubgrupo},
        '${_genero}',
        '${_edad}',
        ${_costo}, 
        ${data.modo_precio}, 
        ${data.precio},
        '${esf}',
        '${cil}',
        '${ad}'
        )`;

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

const obtener_codigos_categoria = (data,callback) => {
    const _query = `
    SELECT c.*, 
    if(c.modo_precio=0, (ROUND((c.costo * sg.multiplicador)/100)*100),if(c.modo_precio = 1,sg.precio_defecto,c.precio)) AS 'precio',
    sg.multiplicador, 
    sg.precio_defecto 
    FROM 
    codigo c, 
    subgrupo sg, grupo g, subfamilia sf
    WHERE 
    c.subgrupo_idsubgrupo = sg.idsubgrupo AND
    sg.grupo_idgrupo = g.idgrupo AND 
    g.subfamilia_idsubfamilia = sf.idsubfamilia AND 
    (case when '-1' <> '${data.idsubgrupo}' then sg.idsubgrupo = '${data.idsubgrupo}' ELSE TRUE END ) AND 
    (case when '-1' <> '${data.idgrupo}' then g.idgrupo = '${data.idgrupo}' ELSE TRUE END) AND 
    (case when '-1' <> '${data.idsubfamilia}' then sf.idsubfamilia = '${data.idsubfamilia}' ELSE TRUE END) AND 
    (case when '-1' <> '${data.idfamilia}' then sf.familia_idfamilia = '${data.idfamilia}' ELSE TRUE END) AND 
    (case when '-1' <> '${data.modo_precio}' then c.modo_precio=${data.modo_precio} else true end)
    ;`;
    console.log(_query)
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(_query, (err,rows)=>{
        callback(rows);
    });
    connection.end();
}

const editar_codigo = (data, callback) => {
    const query = `update codigo c set 
    c.descripcion = '${data.descripcion}',
    c.modo_precio = '${data.modo_precio}',
    c.precio = ${data.precio}
    where c.idcodigo = ${data.idcodigo}
    `
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

module.exports = {
    editar_codigo,
    obtener_codigos,
    agregar_codigo,
    obtener_codigos_bysubgrupo_opt,
    search_codigos,
    obtener_codigo_por_id,
    obtener_codigo,
    obtener_codigos_categoria,
    obtener_codigos_filtros,
}
