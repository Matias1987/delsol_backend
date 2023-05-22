const mysql_connection = require("../lib/mysql_connection")

/* FOR SEARCH PURPOSES, the client sends a code as a parameter for search and
    the server returns a list of stocks rows
*/

const modificar_cantidad = (data, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = `UPDATE stock s SET s.cantidad = ${data.cantidad} 
    WHERE s.sucursal_idsucursal=${data.idsucursal} AND s.codigo_idcodigo=${data.idcodigo};`;
    connection.query(sql,(err,response)=>{
        callback(response)
        //if idfactura exists..
        if(data.fkfactura!=-1)
        {
            let query_str = `INSERT INTO codigo_factura (
                stock_codigo_idcodigo,
                factura_idfactura,
                cantidad,
                costo)
                VALUES (${data.idcodigo}, ${data.fkfactura}, ${data.cantidad}, ${data.costo})`;

                connection.query(query_str);
        }
        //update codigo
        console.log(`UPDATE codigo c SET c.costo = ${data.costo} WHERE c.idcodigo='${data.idcodigo}';`)
        connection.query(`UPDATE codigo c SET c.costo = ${data.costo} WHERE c.idcodigo='${data.idcodigo}';`)
        connection.end();
    })
    
}

const search_stock = (search_value, idsucursal, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    
    const _sql = `SELECT 
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
                    s.codigo_idcodigo = c.idcodigo AND
                    c.subgrupo_idsubgrupo = sg.idsubgrupo AND
                    sg.grupo_idgrupo = g.idgrupo AND
                    g.subfamilia_idsubfamilia = sf.idsubfamilia AND
                    sf.familia_idfamilia = f.idfamilia AND
                    c.codigo LIKE '%${search_value}%';`

    connection.query(_sql,(err,rows)=>{
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
                s.cantidad,
                c.costo
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

const obtener_detalle_stock_sucursal_v2 = (idsucursal, idcodigo,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();

    const sql = `SELECT 
                CONCAT(f.nombre_corto, '/ ' , sf.nombre_corto, '/ ', g.nombre_corto, '/ ', sg.nombre_corto, '/ ') AS 'ruta',
                c.codigo, c.costo, s.cantidad, c.descripcion, c.idcodigo,
                sg.multiplicador
                FROM 
                stock s, codigo c,
                grupo g, subgrupo sg, familia f, subfamilia sf 
                WHERE
                c.subgrupo_idsubgrupo = sg.idsubgrupo AND
                sg.grupo_idgrupo = g.idgrupo AND
                g.subfamilia_idsubfamilia = sf.idsubfamilia AND 
                sf.familia_idfamilia = f.idfamilia AND 
                s.codigo_idcodigo = c.idcodigo AND 
                s.sucursal_idsucursal = ${idsucursal} AND
                c.idcodigo = ${idcodigo};`;

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
        if(data.factura_idfactura>0)
        {
            let query_str = `INSERT INTO codigo_factura (
                stock_codigo_idcodigo,
                factura_idfactura,
                cantidad,
                costo)
                VALUES (${data.codigo_idcodigo}, ${data.factura_idfactura}, ${data.cantidad}, ${data.costo})`;
                console.log(query_str)
                connection.query(query_str);
        }

        connection.end();
    })


    

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
        
        //console.log(query_insert_codigos);
        //console.log(query_insert_stock);
        //console.log(update_queries);

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
    /* @Returns a list with stock for each branch */
    const stock_codigo_sucursales = (idcodigo, callback) => {

        const query = `SELECT 
        if(st.sucursal_idsucursal is NULL,0, st.cantidad) AS 'cantidad',
        s.nombre AS 'sucursal'
         FROM sucursal s LEFT JOIN 
        (SELECT s1.cantidad, s1.sucursal_idsucursal FROM stock s1 WHERE s1.codigo_idcodigo = ${idcodigo})
        AS  st 
        ON st.sucursal_idsucursal = s.idsucursal; `;
        const connection = mysql_connection.getConnection();
        connection.connect();
        connection.query(query,(err,rows)=>{
            callback(rows)
        })
        connection.end();

    }


module.exports = {
    agregar_stock,
    obtener_stock,
    obtener_stock_por_subgrupo,
    obtener_detalle_stock_sucursal,
    obtener_detalle_stock_sucursal_v2,
    search_stock,
    modificar_cantidad,
    obtener_codigos_sin_stock_sucursal,
    agregar_stock_lote,
    obtener_stock_sucursal,
    stock_codigo_sucursales,
}