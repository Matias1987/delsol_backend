const mysql_connection = require("../lib/mysql_connection")

/* FOR SEARCH PURPOSES, the client sends a code as a parameter for search and
    the server returns a list of stocks rows
*/

const incrementar_cantidad = (data, callback) => {
    var codigos = "";
    data.codigos.forEach(c=>{
        codigos += `${ (codigos.length>0 ? ',':'') + c.idcodigo}`;
    })
    const connection = mysql_connection.getConnection();
    connection.connect();
    const sql = `UPDATE stock s SET s.cantidad = (s.cantidad + ${data.cantidad}) 
    WHERE s.sucursal_idsucursal=${data.idsucursal} AND s.codigo_idcodigo  in (${codigos});`;
    connection.query(sql,(err,response)=>{
        callback(response)
        //if idfactura exists..
        if(data.fkfactura!=-1)
        {
            /*let query_str = `INSERT INTO codigo_factura (
                stock_codigo_idcodigo,
                factura_idfactura,
                cantidad,
                costo)
                VALUES (${data.idcodigo}, ${data.fkfactura}, ${data.cantidad}, ${data.costo < 0 ? 0 : data.costo})`;*/
            let query_str = `INSERT INTO codigo_factura (
                stock_codigo_idcodigo,
                factura_idfactura,
                cantidad,
                costo)(
					 SELECT c.idcodigo, '${data.fkfactura}', '${data.cantidad}', '${data.costo < 0 ? 0 : data.costo}' 
					 FROM codigo c WHERE c.idcodigo IN (${codigos}))`
                console.log(query_str)
                connection.query(query_str);
        }
        //update costo
        //console.log(`UPDATE codigo c SET c.costo = ${data.costo} WHERE c.idcodigo='${data.idcodigo}';`)
        if(data.costo>0){
            connection.query(`UPDATE codigo c SET c.costo = ${data.costo} WHERE c.idcodigo in (${codigos});`)
        }      
        if(typeof data.descripcion!=='undefined'){
            if( (data.descripcion.trim()).length > 0)
            {
                connection.query(`UPDATE codigo c SET c.descripcion = '${data.descripcion}' WHERE c.idcodigo in (${codigos});`)
            }
        }  
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

const search_stock_envio = (_search_value, idsucursal_origen, idsucursal_destino, idcodigo, idsubgrupo,  callback) => {
    const search_value = decodeURIComponent(_search_value);
    const connection = mysql_connection.getConnection();
    connection.connect();
    /**
     * se debe pasar el metodo a POST en el cliente, se debe incluir array de ids de familias
     * para limitar la respuesta del servidor 
     */
    const _sql = `SELECT 
                    c.idcodigo,
                    c.codigo AS 'codigo',
                    CONCAT(
                        f.nombre_corto,' / ',sf.nombre_corto, ' / ',
                        g.nombre_corto,' / ',sg.nombre_corto, ' / '
                    ) AS 'ruta',
                    s.cantidad,
                    if(s2.cantidad IS NULL, 0 , s2.cantidad) AS 'cantidad_sucursal'
                FROM 
                familia f, subfamilia sf, grupo g, subgrupo sg,
                codigo c, 
                stock s 
                LEFT JOIN (SELECT _s.cantidad, _s.codigo_idcodigo FROM stock _s WHERE _s.sucursal_idsucursal = ${idsucursal_destino}) 
                as s2 ON s2.codigo_idcodigo = s.codigo_idcodigo
                WHERE
                
                s.sucursal_idsucursal = ${idsucursal_origen} AND
                s.codigo_idcodigo = c.idcodigo AND
                c.subgrupo_idsubgrupo = sg.idsubgrupo AND
                sg.grupo_idgrupo = g.idgrupo AND
                g.subfamilia_idsubfamilia = sf.idsubfamilia AND
                sf.familia_idfamilia = f.idfamilia AND
                (case when '${search_value}' <> 'null' then c.codigo LIKE '%${search_value}%' else true end) AND
                (case when '${idcodigo}' <> '0' then c.idcodigo = ${idcodigo} else true end) AND
                (case when '${idsubgrupo}' <> '-1' then c.subgrupo_idsubgrupo=${idsubgrupo} else true end)
                limit 1000;`
    console.log(_sql)
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
                c.costo,
                if(c.modo_precio=0, (ROUND((c.costo * sg.multiplicador)/100)*100),if(c.modo_precio = 1,sg.precio_defecto,c.precio)) AS 'precio',
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
                c.codigo, c.costo, s.cantidad, c.descripcion, c.idcodigo,c.genero, c.edad,
                if(c.modo_precio=0, (ROUND((c.costo * sg.multiplicador)/100)*100),if(c.modo_precio = 1,sg.precio_defecto,c.precio)) AS 'precio',
                sg.multiplicador,
                c.modo_precio,
                sg.idsubgrupo
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
                //console.log(query_str)
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

    
    const descontar_cantidad_por_codigo = (_data,callback) => {
        const data ={
            cantidad: _data.cantidad,
            fksucursal: _data.sucursal,
            codigo: _data.codigo,
        }
        const connection = mysql_connection.getConnection();
        connection.connect();

        //check if code exists!

        connection.query(`SELECT c.idcodigo FROM stock s, codigo c WHERE c.idcodigo = s.codigo_idcodigo AND 
        c.codigo = '${data.codigo}'`,(err,_res)=>{

            //console.log(" codigo existe?", JSON.stringify(_res))

            if(_res.length>0){
                //stock exists
                //console.log("el codigo existe")
                const query = `UPDATE stock s, codigo c 
                SET s.cantidad = (s.cantidad - ${data.cantidad} )
                WHERE 
                s.codigo_idcodigo = idcodigo AND 
                s.sucursal_idsucursal = ${data.fksucursal} AND 
                c.codigo='${data.codigo}';`;
        
                connection.query(query,(err,resp)=>{
                    callback(resp)
                })
            }
            else{
                //stock doesn't exists
                //console.log("EL CODIGO NO EXISTE")
                callback(-1)
            }

            connection.end();
        })


    }

    const obtener_lista_stock_filtros = (data, callback)=>{
            
        var order = '';

        if(typeof data.order !== 'undefined'){
            switch(data.order){
                case 'alf_asc': order=' order by c.codigo asc';break;
                case 'alf_desc': order=' order by c.codigo desc';break;
                case 'precio_desc': order=' order by c.precio desc';break;
                case 'precio_asc': order=' order by c.precio asc';break;
                case 'cantidad_asc': order=' order by c.cantidad asc';break;
                case 'cantidad_desc': order=' order by c.cantidad desc';break;
            }
        }

        const _query = `SELECT c.* FROM 
        (
            SELECT 
            s.cantidad,
            _c.idcodigo,
            _c.codigo,
            _c.descripcion, 
            _c.edad,
            _c.genero,
            sg.multiplicador,
            if(_c.modo_precio=0, (ROUND((_c.costo * sg.multiplicador)/100)*100),if(_c.modo_precio = 1,sg.precio_defecto,_c.precio)) AS 'precio',
            sg.idsubgrupo,
            g.idgrupo,
            sf.idsubfamilia,
            f.idfamilia,
            f.nombre_corto as 'familia',
            sf.nombre_corto as 'subfamilia',
            g.nombre_corto as 'grupo',
            sg.nombre_corto as 'subgrupo'
            FROM familia f, subfamilia sf, grupo g, subgrupo sg, stock s, codigo _c WHERE 
            sg.grupo_idgrupo = g.idgrupo AND
            g.subfamilia_idsubfamilia = sf.idsubfamilia AND
            sf.familia_idfamilia = f.idfamilia AND
            _c.subgrupo_idsubgrupo = sg.idsubgrupo AND 
            _c.idcodigo = s.codigo_idcodigo AND
            s.sucursal_idsucursal = ${data.sucursal}
        ) AS c
         WHERE
        (case when '${data.codigo_contenga_a}' <> '' then c.codigo like '%${data.codigo_contenga_a}%' else TRUE end) and
        (case when '${data.codigo_igual_a}' <> '' then c.codigo = '${data.codigo_igual_a}' else true end) and
        (case when '${data.precio_mayor_a}' <> '' then c.precio > '${data.precio_mayor_a}' else true end) and
        (case when '${data.precio_menor_a}' <> '' then c.precio < '${data.precio_menor_a}' else true end) and
        (case when '${data.precio_igual_a}' <> '' then c.precio = '${data.precio_igual_a}' else true end) and
        (case when '${data.cantidad_igual_a}' <> '' then c.cantidad = '${data.cantidad_igual_a}' else true end) and
        (case when '${data.cantidad_mayor_a}' <> '' then c.cantidad > '${data.cantidad_mayor_a}' else true end) and
        (case when '${data.cantidad_menor_a}' <> '' then c.cantidad < '${data.cantidad_menor_a}' else true end) and
        (case when '${data.sexo}' <> '' then c.genero like '%${data.sexo}%' else true end) and
        (case when '${data.edad}' <> '' then c.edad like '%${data.edad}%' else true end) and 
        (case when '${data.descripcion}' <> '' then c.descripcion like '%${data.descripcion}%' else true end) and
        (case when '${data.subgrupo}' <> '' then c.idsubgrupo = '${data.subgrupo}' else true end) and
        (case when '${data.grupo}' <> '' then c.idgrupo = '${data.grupo}' else true end) and
        (case when '${data.subfamilia}' <> '' then c.idsubfamilia = '${data.subfamilia}' else true end) and
        (case when '${data.familia}' <> '' then c.idfamilia = '${data.familia}' else true end) 
        ${order}
        ;
        `;
        console.log(_query);
        const connection = mysql_connection.getConnection();
        connection.connect();

        connection.query(_query,(err,rows)=>{
            callback(rows)
        });

        connection.end();

    }

    const obtener_stock_ventas = (filters, callback) => {
        //temporary!
        var str = "-1";
        console.log("FILTRO DE FAMILIAS: " + JSON.stringify(filters))
        var _values = filters.filtroFamilias;
        _values.forEach(i=>{str+=`${(str.length>0 ? ',' : '') + i}`
        })

        const _query = `SELECT 
        c.idcodigo, 
        c.codigo, 
        c.descripcion
        FROM stock s , codigo c, subgrupo sg, grupo g, subfamilia sf WHERE
        s.codigo_idcodigo = c.idcodigo AND 
        c.subgrupo_idsubgrupo = sg.idsubgrupo AND
        sg.grupo_idgrupo = g.idgrupo AND 
        g.subfamilia_idsubfamilia = sf.idsubfamilia AND
        (case when '${str}' <> '-1' then sf.familia_idfamilia IN (${str}) ELSE TRUE end) and 
        s.sucursal_idsucursal=${filters.idSucursal} and 
        (c.codigo like '%${filters.filtroCod}%' or c.descripcion like '%${filters.filtroCod}%')
        LIMIT 100
        ;`;

        console.log(_query)

        const connection = mysql_connection.getConnection();
        connection.connect();
        connection.query(_query,(err,rows)=>{
            //console.log(JSON.stringify(rows))
            callback(rows)
        })
        connection.end();

    }
    const obtener_stock_detalles_venta = (data, callback) =>{
        const _query  = `SELECT 
        c.idcodigo,
        s.cantidad, 
        c.codigo, 
        if(c.modo_precio=0, (ROUND((c.costo * sg.multiplicador)/100)*100),if(c.modo_precio = 1,sg.precio_defecto,c.precio)) AS 'precio',
        c.descripcion,
        c.costo,
        sg.multiplicador
        FROM stock s , codigo c, subgrupo sg
        WHERE 
        s.codigo_idcodigo = c.idcodigo AND 
        c.subgrupo_idsubgrupo = sg.idsubgrupo AND 
        c.idcodigo = ${data.idcodigo} AND
        s.sucursal_idsucursal = ${data.idsucursal};`;

        const connection = mysql_connection.getConnection();
        connection.connect();
        connection.query(_query,(err,rows)=>{
            callback(rows)
        })
        connection.end();
    }



    const verificar_cantidades_stock_sucursal = (data, callback) =>{
        var _quantities =  []
        const prepare_qtty_array = elements => {
        //accum by idcodigo
        elements.forEach(e=>{
            if(typeof _quantities[e.idcodigo] === 'undefined')
            {
                _quantities = {..._quantities, [e.idcodigo]:{cantidad: e.cantidad, idcodigo: e.idcodigo}}
            } else{
                _quantities[e.idcodigo].cantidad += e.cantidad
            }
        })
        }

        var _ids = "";
        _quantities.forEach(q=>{_ids = (_ids.length>0 ? ",":"")+q.idcodigo})
        
        const query = `SELECT  
        s.codigo_idcodigo, 
        s.cantidad, 
        c.codigo 
        FROM 
        stock s, 
        codigo c  
        where s.codigo_idcodigo = c.idcodigo AND 
        s.codigo_idcodigo IN (${_ids}) 
        AND s.sucursal_idsucursal = ${data.idsucursal};`
        
        console.log(query)

        const connection = mysql_connection.getConnection();
        
        connection.connect();
        
        connection.query(query,(err,rows)=>{
            var data = []

            rows.forEach(r=>{
                if(_quantities[r.idcodigo].cantidad<r.cantidad)
                {
                    data.push({
                        msg:"error",
                        codigo: r.codigo, //<---add in query!
                        idcodigo: r.idcodigo,
                        request_qtty: _quantities[r.idcodigo],
                        existing_qtty: r.cantidad,
                    })
                }
            })
            
            callback(data)
        })
        connection.end();
    }


    const obtener_subgrupo_full = (callback) => {

        const query = `SELECT 
        f.nombre_corto AS 'familia',
        sf.nombre_corto AS 'subfamilia',
        g.nombre_corto AS 'grupo',
        sg.nombre_corto AS 'subgrupo',
        f.idfamilia,
        sf.idsubfamilia, 
        g.idgrupo,
        sg.idsubgrupo
        FROM familia f, subfamilia sf, grupo g, subgrupo sg WHERE
        sg.grupo_idgrupo = g.idgrupo AND
        g.subfamilia_idsubfamilia = sf.idsubfamilia AND
        sf.familia_idfamilia = f.idfamilia;`

        const connection = mysql_connection.getConnection()
        connection.connect()
        connection.query(query,(err,rows)=>{
            console.log(rows)
            callback(rows)
        })
        connection.end()
    }

    const modificar_cantidad_categoria = (data, callback) => {
        const query = `UPDATE 
        stock s, 
        codigo c, 
        subgrupo sg,
        grupo g,
        subfamilia sf
        SET s.cantidad = ${data.cantidad}
        WHERE
        s.sucursal_idsucursal=${data.idsucursal} AND 
        s.codigo_idcodigo = c.idcodigo AND
        c.subgrupo_idsubgrupo = sg.idsubgrupo AND 
        sg.grupo_idgrupo = g.idgrupo AND 
        g.subfamilia_idsubfamilia = sf.idsubfamilia AND 
        (case when '-1'<>'${data.idfamilia}' then sf.familia_idfamilia = ${data.idfamilia} ELSE TRUE END ) AND
        (case when '-1'<>'${data.idsubfamilia}' then sf.idsubfamilia = ${data.idsubfamilia} ELSE TRUE END ) AND 
        (case when '-1' <> '${data.idgrupo}' then g.idgrupo = ${data.idgrupo} ELSE TRUE END ) AND 
        (case when '-1' <> '${data.idsubgrupo}' then sg.idsubgrupo = ${data.idsubgrupo} ELSE TRUE END )
        ;
        `
        ;

        const connection = mysql_connection.getConnection()
        connection.connect()
        connection.query(query,(err,resp)=>{
            callback(resp)
        })
        connection.end()
    }

module.exports = {
    obtener_subgrupo_full,
    agregar_stock,
    obtener_stock,
    obtener_stock_por_subgrupo,
    obtener_detalle_stock_sucursal,
    obtener_detalle_stock_sucursal_v2,
    search_stock,
    incrementar_cantidad,
    obtener_codigos_sin_stock_sucursal,
    agregar_stock_lote,
    obtener_stock_sucursal,
    stock_codigo_sucursales,
    search_stock_envio,
    descontar_cantidad_por_codigo,
    obtener_lista_stock_filtros,
    obtener_stock_ventas,
    obtener_stock_detalles_venta,
    modificar_cantidad_categoria,
}