const mysql_connection = require("../lib/mysql_connection");

const obtener_subgrupos_grupo = (idsubfamilia, callback) => {
  const q = `SELECT g.nombre_corto AS 'grupo', 
    sg.nombre_largo AS 'subgrupo', 
    sg.precio_defecto AS 'precio', 
    sg.idsubgrupo, 
    g.idgrupo 
    FROM subgrupo sg, grupo g WHERE 
    sg.grupo_idgrupo=g.idgrupo and
    g.subfamilia_idsubfamilia=${idsubfamilia} 
    ORDER BY 
    sg.grupo_idgrupo;`;
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(q, (err, rows) => {
    callback(rows);
  });
  connection.end();
};

const modificar_precios_defecto = (data, callback) => {
  if (
    data.idfamilia < 0 &&
    data.idsubfamilia < 0 &&
    data.idgrupo < 0 &&
    data.idsubgrupo < 0
  ) {
    /* ERROR */
    console.log("ERROR, AL VALUES ARE LESS THAN 1. FILTER REQUIRED");
    return;
  }
  const connection = mysql_connection.getConnection();

  const modif_precio_mayorista =
    +(data.modif_precio_mayorista || "0") == 0
      ? false
      : +data.modif_precio_mayorista == 1;

  //console.log("modif_precio_mayorista: " + modif_precio_mayorista);

  let set_part = !modif_precio_mayorista
    ? `SET sg.precio_defecto = truncate((sg.precio_defecto + sg.precio_defecto * ${parseFloat(data.multiplicador)} ) / ${data.roundFactor},0) * ${data.roundFactor}`
    : `SET sg.precio_defecto_mayorista = truncate((sg.precio_defecto_mayorista * ${parseFloat(
        data.multiplicador
      )} ) / ${data.roundFactor},0) * ${data.roundFactor} + ${parseFloat(
        data.valor
      )}`;

  const query = `update
    subgrupo sg,
    grupo g,
    subfamilia sf, 
    familia f
    ${set_part}
    WHERE 
    sg.grupo_idgrupo=g.idgrupo AND
    g.subfamilia_idsubfamilia = sf.idsubfamilia AND
    sf.familia_idfamilia = f.idfamilia AND
    (case when '-1' <> '${data.idfamilia}' then f.idfamilia = ${data.idfamilia} ELSE TRUE END) AND 
    (case when '-1' <> '${data.idsubfamilia}' then sf.idsubfamilia = ${data.idsubfamilia} ELSE TRUE END) AND 
    (case when '-1' <> '${data.idgrupo}' then g.idgrupo = ${data.idgrupo} ELSE TRUE END) AND 
    (case when '-1' <> '${data.idsubgrupo}' then sg.idsubgrupo = ${data.idsubgrupo} ELSE TRUE END)
    ;`;

  console.log(query)
    //  return callback({message: "Modificando precios..."});

  connection.connect();
  connection.query(query, (err, resp) => {
    callback(resp);
  });

  connection.end();
};

const modificar_multiplicador_grupos = (
  categoria,
  id,
  value,
  incrementar,
  callback
) => {
  const connection = mysql_connection.getConnection();
  connection.connect();

  const _q =
    incrementar == 1
      ? `
                UPDATE subgrupo sg, grupo g, subfamilia sf 
                SET sg.multiplicador = if(sg.multiplicador = 0, TRUNCATE(${value},2),TRUNCATE(sg.multiplicador * ${value},2))
                WHERE 
                sg.grupo_idgrupo = g.idgrupo AND
                g.subfamilia_idsubfamilia = sf.idsubfamilia AND
                (case when '${
                  categoria == "subgrupo" ? id : ""
                }' <> '' then sg.idsubgrupo = '${
          categoria == "subgrupo" ? id : ""
        }'  ELSE TRUE END) AND
                (case when '${
                  categoria == "grupo" ? id : ""
                }' <> '' then g.idgrupo = '${
          categoria == "grupo" ? id : ""
        }' ELSE TRUE END) AND
                (case when '${
                  categoria == "subfamilia" ? id : ""
                }' <> '' then sf.idsubfamilia = '${
          categoria == "subfamilia" ? id : ""
        }' ELSE TRUE END) AND 
                (case when '${
                  categoria == "familia" ? id : ""
                }' <> '' then sf.familia_idfamilia = '${
          categoria == "familia" ? id : ""
        }' ELSE TRUE END);`
      : `
                UPDATE subgrupo sg, grupo g, subfamilia sf 
                SET sg.multiplicador = ${value}
                WHERE 
                sg.grupo_idgrupo = g.idgrupo AND
                g.subfamilia_idsubfamilia = sf.idsubfamilia AND
                (case when '${
                  categoria == "subgrupo" ? id : ""
                }' <> '' then sg.idsubgrupo = '${
          categoria == "subgrupo" ? id : ""
        }'  ELSE TRUE END) AND
                (case when '${
                  categoria == "grupo" ? id : ""
                }' <> '' then g.idgrupo = '${
          categoria == "grupo" ? id : ""
        }' ELSE TRUE END) AND
                (case when '${
                  categoria == "subfamilia" ? id : ""
                }' <> '' then sf.idsubfamilia = '${
          categoria == "subfamilia" ? id : ""
        }' ELSE TRUE END) AND 
                (case when '${
                  categoria == "familia" ? id : ""
                }' <> '' then sf.familia_idfamilia = '${
          categoria == "familia" ? id : ""
        }' ELSE TRUE END);`;

  //console.log(_q);
  connection.query(_q, (err, data) => {
    callback(data);
  });

  connection.end();
};

const obtener_subgrupos_bygrupo_opt = (params, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  const query = `SELECT 
                        sg.*, 
                        (sg.precio_defecto * 2) as 'precio_par', 
                        sg.idsubgrupo as 'value', 
                        sg.nombre_largo as 'label',
                        g.idgrupo,
                        sf.idsubfamilia,
                        sf.familia_idfamilia 
                        FROM 
                        subgrupo sg , grupo g, subfamilia sf
                        WHERE 
                        sg.grupo_idgrupo=g.idgrupo AND 
                        g.subfamilia_idsubfamilia = sf.idsubfamilia AND 
                        sg.grupo_idgrupo=${params.grupoId} AND 
                        (case when '${params.ignorarOcultos}'<>'0' then sg.visible_lp=1 else true end)
                        ;`
  //console.log(query);
  connection.query(
    query,
    (err, rows, fields) => {
      return callback(rows);
    }
  );
  connection.end();
};

const obtener_subgrupos = (idg, callback, idsf = -1, idf = -1, idsg = -1) => {
  const connection = mysql_connection.getConnection();
  connection.connect();

  connection.query(
    `
        select 
        CONCAT(f.nombre_corto , ' / ', sf.nombre_corto, '  / ', g.nombre_corto , ' / ') AS 'ruta', 
        sg.* 
        from 
        subgrupo sg, 
        grupo g, 
        subfamilia sf, 
        familia f 
        WHERE
        sg.grupo_idgrupo = g.idgrupo AND 
        g.subfamilia_idsubfamilia = sf.idsubfamilia AND
        sf.familia_idfamilia = f.idfamilia AND 
        (case when '${idg}' <> '-1' then sg.grupo_idgrupo = ${idg} else true end) and 
        (case when '${idsf}' <> '-1' then g.subfamilia_idsubfamilia = ${idsf} else true end) and 
        (case when '${idf}' <> '-1' then sf.familia_idfamilia = ${idf} else true end) and
        (case when '${idsg}' <> '-1' then sg.idsubgrupo = ${idsg} else true end) 
    ;`,
    (err, rows, fields) => {
      return callback(rows);
    }
  );
  connection.end();
};

const agregar_subgrupo = (data, callback) => {
  //console.log(JSON.stringify(data))
  if ((data.grupo_idgrupo || "") == "") {
    return callback(-1);
  }

  const connection = mysql_connection.getConnection();
  connection.connect();

  connection.query(
    `select sg.idsubgrupo from subgrupo sg where sg.nombre_corto = ${connection.escape(
      data.nombre_corto
    )} and sg.grupo_idgrupo=${connection.escape(data.grupo_idgrupo)}`,
    (err, rows) => {
      if (rows.length > 0) {
        return callback(-1);
      } else {
        var sql = `insert into subgrupo (nombre_corto, nombre_largo,grupo_idgrupo,  precio_defecto, no_stock) values (
                ${connection.escape(data.nombre_corto)},${connection.escape(
          data.nombre_largo
        )},${connection.escape(data.grupo_idgrupo)},${connection.escape(
          data.precio_defecto
        )},${+data.control_stock == 0 ? 1 : 0}
            )`;

        try {
          connection.query(sql, (err, result) => {
            return callback(result.insertId);
          });
        } catch (e) {
          return callback(-1);
        }
      }

      connection.end();
    }
  );
};

const obtener_detalle_subgrupo = (id, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  const query = `SELECT 
                    f.nombre_corto AS 'familia',
                    sf.nombre_corto AS 'subfamilia',
                    g.nombre_corto AS 'grupo',
                    sg.* ,
                    if(dc.iddetalle IS NOT NULL AND (sg.comentarios IS NULL OR sg.comentarios='null'),dc.descripcion, sg.comentarios) as 'comentarios'
                    FROM 
                    subgrupo sg left join detalle_categoria dc on sg.idsubgrupo=dc.fkcategoria,
                    grupo g,
                    subfamilia sf,
                    familia f
                    WHERE
                    sg.grupo_idgrupo=g.idgrupo AND 
                    g.subfamilia_idsubfamilia = sf.idsubfamilia AND 
                    sf.familia_idfamilia = f.idfamilia AND 
                    sg.idsubgrupo=${id};`;
  //console.log(query);
  connection.query(query, (err, rows) => {
    callback(rows);
  });
  connection.end();
};

const obtener_descripcion_cat_subgrupo = (id, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  const query = `select * from detalle_categoria dc where  dc.fkcategoria=${id};`;
  connection.query(query, (err, rows) => {
    callback(rows);
  });
  connection.end();
};

const editarSubgrupo = (data, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  //console.log("updating subgrupo " + data.visible_lp)

  const q = `update subgrupo sg set 
    sg.visible_lp = ${connection.escape(data.visible_lp)},
    sg.nombre_largo=${connection.escape(
      data.nombre_largo
    )}, sg.precio_defecto=${connection.escape(
      data.precio_defecto
    )}, sg.comentarios=${connection.escape(
      data.comentarios
    )}, sg.precio_defecto_mayorista=${connection.escape(
      data.precio_defecto_mayorista
    )} where sg.idsubgrupo = ${connection.escape(data.idsubgrupo)}`

    //console.log(q)


  connection.query(
    q,
    (err, resp) => {
        if(err){
            console.log(err);
            return callback(-1);
        }
      callback(resp);
    }
  );
  connection.end();
};

const mover = (data, callback) => {
  const query = `update subgrupo sg set sg.grupo_idgrupo=${
    data.targetId
  } where sg.idsubgrupo in (${data.ids.map((sg) => sg)});`;

  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, (err, resp) => {
    callback(resp);
  });
  connection.end();
};

module.exports = {
  mover,
  editarSubgrupo,
  obtener_subgrupos,
  agregar_subgrupo,
  obtener_subgrupos_bygrupo_opt,
  modificar_multiplicador_grupos,
  obtener_detalle_subgrupo,
  modificar_precios_defecto,
  obtener_descripcion_cat_subgrupo,
  obtener_subgrupos_grupo,
};
