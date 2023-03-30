const mysql_connection = require("../lib/mysql_connection")

const obtener_stock = (data,callback) => {
    /*
    esta lista es generica, ie, incluye a todas sucursales
    */
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = `SELECT 
    c.codigo AS 'codigo',
    s.cantidad AS 'cantidad',
    CONCAT(
        f.nombre_corto,' / ',sf.nombre_corto, ' / ',
        g.nombre_corto,' / ',sg.nombre_corto, ' / '
    ) AS 'ruta'
    FROM stock s, codigo c, subgrupo sg, grupo g, subfamilia sf, familia f WHERE
    s.codigo_idcodigo = c.idcodigo AND
    c.subgrupo_idsubgrupo = sg.idsubgrupo AND
    sg.grupo_idgrupo = g.idgrupo AND
    g.subfamilia_idsubfamilia = sf.idsubfamilia AND
    sf.familia_idfamilia = f.idfamilia
    LIMIT 100;`;
    connection.query(sql,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

const agregar_stock = (data,callback) =>{

    const connection = mysql_connection.getConnection();
    connection.connect();


    const sql = "insert into stock (sucursal_idsucursal,codigo_idcodigo,cantidad) values (?)";

    const values = [
        [
            data.sucursal_idsucursal,
            data.codigo_idcodigo,
            data.cantidad,
        ]
    ]

    connection.query(sql,values,(err,results,fields)=>{
        callback(results.insertId);
    })


    connection.end();

}

module.exports = {
    agregar_stock,
    obtener_stock,
}