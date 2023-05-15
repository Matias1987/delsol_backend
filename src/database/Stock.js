const mysql_connection = require("../lib/mysql_connection")

/* FOR SEARCH PURPOSES, the client sends a code as a parameter for search and
    the server returns a list of stocks rows
*/

const modificar_cantidad = (idcodigo, idsucursal, cantidad, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = `UPDATE stock s SET s.cantidad = ${cantidad} 
    WHERE s.sucursal_idsucursal=${idsucursal} AND s.codigo_idcodigo=${idcodigo};`;
    console.log(sql)
    connection.query(sql,(err,data)=>{
        callback(data)
    })
    connection.end()
}

const search_stock = (search_value, idsucursal, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = `SELECT c.idcodigo,  c.codigo, c.descripcion  FROM codigo c, stock s WHERE 
                c.idcodigo=s.codigo_idcodigo 
                AND s.sucursal_idsucursal = ${idsucursal} 
                AND c.codigo LIKE '%${search_value}%';`
    connection.query(sql,(err,rows)=>{
        callback(rows);
    })
    connection.end();
}

const obtener_detalle_stock_sucursal = (idsucursal, idcodigo,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();

    const sql = `SELECT 
                c.idcodigo,
                c.codigo AS 'codigo',
                CONCAT(
                    f.nombre_corto,' / ',sf.nombre_corto, ' / ',
                    g.nombre_corto,' / ',sg.nombre_corto, ' / '
                ) AS 'ruta',
                s.cantidad
            FROM 
            familia f, subfamilia sf, grupo g, subgrupo sg,
            codigo c, stock s WHERE
            s.sucursal_idsucursal = ${idsucursal} AND
            s.codigo_idcodigo = ${idcodigo} AND 
            s.codigo_idcodigo = c.idcodigo AND
            c.subgrupo_idsubgrupo = sg.idsubgrupo AND
            sg.grupo_idgrupo = g.idgrupo AND
            g.subfamilia_idsubfamilia = sf.idsubfamilia AND
            sf.familia_idfamilia = f.idfamilia;`;

    connection.query(sql,(err,rows)=>{
        callback(rows)
    })

    connection.end();
}

//FALTA AGREGAR FILTRO POR SUCURSAL
const obtener_stock_por_subgrupo = (idsubgrupo,callback)=>{
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = `SELECT 
                c.codigo AS 'codigo',
                s.cantidad,
                CONCAT(
                    f.nombre_corto,' / ',sf.nombre_corto, ' / ',
                    g.nombre_corto,' / ',sg.nombre_corto, ' / '
                ) AS 'ruta'
                FROM stock s, codigo c, subgrupo sg, grupo g, subfamilia sf, familia f WHERE
                s.codigo_idcodigo = c.idcodigo AND
                c.subgrupo_idsubgrupo = sg.idsubgrupo AND
                sg.grupo_idgrupo = g.idgrupo AND
                g.subfamilia_idsubfamilia = sf.idsubfamilia AND
                sf.familia_idfamilia = f.idfamilia AND 
                sg.idsubgrupo = ${idsubgrupo};`
    connection.query(sql,(err,rows)=>{
        callback(rows)
    })
    connection.end();
}

const obtener_stock = (idsucursal,callback) => {
    /*
    esta lista es generica, ie, incluye a todas sucursales
    */
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = `SELECT 
    c.idcodigo,
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
    sf.familia_idfamilia = f.idfamilia AND
    s.sucursal_idsucursal = ${idsucursal}
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

    const obtener_codigos_sin_stock_sucursal = (idsucursal, callback) => {
        const query = `SELECT c.* FROM codigo c WHERE c.idcodigo NOT IN (
            SELECT s.codigo_idcodigo FROM stock s WHERE s.sucursal_idsucursal=${idsucursal});`;
        const connection = mysql_connection.getConnection();
        connection.connect();
        connection.query(query,(err,rows)=>{
            callback(rows)
        });
        connection.end();


    }

    const agregar_stock_lote = (data, callback) => {

        var _codigos_str = ""

        let _values = "";

        let update_queries ="";

        data.codigos.forEach(r=>{

            _values += (_values.length>0? ",":"") + `(${data.subgrupo},'${r.codigo}','descripcion',${r.costo})`; // "("+data.subgrupo,r.codigo,"descripcion",r.costo+")";
            _codigos_str += `'${r.codigo}',`; 
            update_queries+=`UPDATE stock s SET s.cantidad=${r.cantidad} WHERE s.codigo_idcodigo=${r.codigo} AND s.sucursal_idsucursal=${data.sucursal};`;
        
        })

        const query_insert_codigos=`INSERT ignore INTO codigo  (subgrupo_idsubgrupo, codigo, descripcion, costo) VALUES` + _values;
        
        const query_insert_stock=`INSERT ignore INTO stock  (sucursal_idsucursal, codigo_idcodigo, cantidad)  (
            SELECT ${data.sucursal}, c.idcodigo, 0 FROM codigo c WHERE c.codigo IN (${_codigos_str})
        )`;
        
        console.log(query_insert_codigos);
        console.log(query_insert_stock);
        console.log(update_queries);

        const connection = mysql_connection.getConnection();

        connection.connect();

        connection.query(query_insert_codigos,(err,res)=>{

            connection.query(query_insert_stock,(_err,_res)=>{

                connection.query(update_queries,(__err,__res)=>{

                    connection.end();

                })

            })

        })
    }

    const obtener_stock_sucursal = (idsucursal, idcodigo, callback)=> {
        const connection = mysql_connection.getConnection();
        connection.connect();
        const sql = `select * from stock s where s.sucursal_idsucursal=${idsucursal} and s.codigo_idcodigo=${idcodigo};`;
        connection.query(sql,(err,rows)=>{
            return callback(rows);
        })

        connection.end();
    }


module.exports = {
    agregar_stock,
    obtener_stock,
    obtener_stock_por_subgrupo,
    obtener_detalle_stock_sucursal,
    search_stock,
    modificar_cantidad,
    obtener_codigos_sin_stock_sucursal,
    agregar_stock_lote,
    obtener_stock_sucursal,
}