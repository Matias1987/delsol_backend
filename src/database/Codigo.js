const mysql_connection = require("../lib/mysql_connection");
const { doQuery } = require("./helpers/queriesHelper");

const obtener_codigos_filtros = (data, callback) => {
  const tags = typeof data.etiquetas === "undefined" ? [] : data.etiquetas;
  //const _codigos = tags.length<1 ? ` ( select 0 as 'cnt', _c.* from codigo _c) ` : `( SELECT COUNT(1) AS 'cnt', _c.* FROM codigo_has_tag ct , codigo _c WHERE ct.fk_codigo = _c.idcodigo AND ct.fk_etiqueta IN ( ${tags.map((_t,idx)=> `'${_t}'` )}) GROUP BY _c.idcodigo )`
  var _codigos =
    tags.length < 1
      ? ` ( select 0 as 'cnt', c.* from codigo c) `
      : `(SELECT c.* FROM (SELECT COUNT(1) AS 'qtty', cht.fk_codigo FROM codigo_has_tag cht WHERE cht.fk_etiqueta IN (${tags.map(
          (_t, idx) => `'${_t}'`
        )}) GROUP BY cht.fk_codigo) ci INNER JOIN codigo c ON c.idcodigo = ci.fk_codigo WHERE ci.qtty>=${
          tags.length
        })`;

  let cod_parts = (data.codigo || "").trim().split(" ");

  let cod_q = "";

  cod_parts.forEach((c) => {
    cod_q += (cod_q == "" ? "" : " and ") + ` c.codigo like '%${c}%' `;
  });

  cod_q = `(${cod_q})`;

  const query = `
    SELECT c.*,
    sg.precio_defecto,
    if(c.modo_precio=0, (ROUND((c.costo * sg.multiplicador)/100)*100),if(c.modo_precio = 1,sg.precio_defecto,c.precio)) AS 'precio_codigo',
    sg.nombre_corto as 'subgrupo',
    g.nombre_corto as 'grupo',
    sf.nombre_corto as 'subfamilia',
    f.nombre_corto as 'familia',
    ctag.tags as 'etiquetas'
    FROM
    subgrupo sg, 
    grupo g, 
    subfamilia sf, 
    familia f,
    ${_codigos} c left join  
    (SELECT cht.fk_codigo,GROUP_CONCAT(cht.fk_etiqueta) as 'tags' FROM codigo_has_tag cht GROUP BY cht.fk_codigo) ctag on ctag.fk_codigo=c.idcodigo 
    WHERE
    c.subgrupo_idsubgrupo=sg.idsubgrupo AND
    sg.grupo_idgrupo = g.idgrupo AND
    g.subfamilia_idsubfamilia = sf.idsubfamilia AND
    sf.familia_idfamilia = f.idfamilia AND 
    ${cod_q} AND 
    (case when '${data.idsubgrupo}'='-1' then TRUE ELSE sg.idsubgrupo='${data.idsubgrupo}' END ) AND 
    (case when '${data.idgrupo}'='-1' then TRUE ELSE g.idgrupo='${data.idgrupo}' END ) AND 
    (case when '${data.idsubfamilia}'='-1' then TRUE ELSE sf.idsubfamilia='${data.idsubfamilia}' END ) AND
    (case when '${data.idfamilia}'='-1' then TRUE ELSE sf.familia_idfamilia='${data.idfamilia}' END )
    ;`;
  //console.log(query)
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, (err, rows) => {
    callback(rows);
  });
  connection.end();
};

const search_codigos = (data, callback) => {
  const _parts = data.trim().split(" ");

  let query_part = "";

  if (_parts.length < 1) {
    return callback([]);
  }

  _parts.forEach((p) => {
    query_part +=
      (query_part.length > 0 ? " AND " : "") + ` c.codigo like '%${p}%' `;
  });
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    `SELECT c.idcodigo,c.codigo,c.descripcion FROM codigo c WHERE ${query_part} limit 100;`,
    (err, rows, fields) => {
      return callback(rows);
    }
  );
  connection.end();
};

const obtener_codigo_por_id = (idcodigo, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    `
    select c.*, 
    if(c.modo_precio=0, (ROUND((c.costo * sg.multiplicador)/100)*100),if(c.modo_precio = 1,sg.precio_defecto,c.precio)) AS 'precio_codigo',
    sg.precio_defecto 
    from codigo c, subgrupo sg 
    where sg.idsubgrupo = c.subgrupo_idsubgrupo and c.idcodigo=${idcodigo}`,
    (err, rows, fields) => {
      return callback(rows);
    }
  );
  connection.end();
};

const obtener_codigo = (codigo, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    `
    select c.*,
    if(c.modo_precio=0, (ROUND((c.costo * sg.multiplicador)/100)*100),if(c.modo_precio = 1,sg.precio_defecto,c.precio)) AS 'precio_codigo',
    sg.precio_defecto 
    from codigo c, subgrupo sg  where sg.idsubgrupo = c.subgrupo_idsubgrupo and  c.codigo='${codigo}'`,
    (err, rows, fields) => {
      return callback(rows);
    }
  );
  connection.end();
};

const obtener_codigos = (callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    "SELECT c.*, sg.multiplicador from codigo c, subgrupo sg WHERE c.subgrupo_idsubgrupo = sg.idsubgrupo;",
    (err, rows, fields) => {
      return callback(rows);
    }
  );
  connection.end();
};

const agregar_codigo = (data, callback) => {
  //var _genero = typeof data.genero === 'undefined' ? '' : data.genero;
  //var _edad = typeof data.edad === 'undefined' ? '' : data.edad;
  var _costo = typeof data.costo === "undefined" ? 0 : data.costo;
  //_genero = _genero == null ? '':_genero;
  //_edad = _edad == null ? '': _edad;
  _costo = _costo == null ? "0" : isNaN(_costo) ? "0" : parseFloat(_costo);

  var esf = typeof data.esf === "undefined" ? "" : data.esf;
  var cil = typeof data.cil === "undefined" ? "" : data.cil;
  var ad = typeof data.ad === "undefined" ? "" : data.ad;

  let valid_string = /^[A-Za-z0-9\-_\.\+]+$/;

  /*
    if(!valid_string.test(data.codigo) || !/^[/A-Za-z0-9\-_\.\+\s\(\)\*]+$/.test(data.descripcion))
    {
        console.log("invalid code")
        callback(-1)
        return
    }*/

  const connection = mysql_connection.getConnection();
  connection.connect();
  var sql = `insert ignore into codigo (
        codigo, 
        descripcion,
        subgrupo_idsubgrupo,
        costo,
        modo_precio,
        precio,
        esf,
        cil,
        ad,
        hook
        ) values (
        '${data.codigo}', 
        '${data.descripcion}', 
        ${data.subgrupo_idsubgrupo},
        ${_costo}, 
        ${data.modo_precio}, 
        ${data.precio},
        '${esf}',
        '${cil}',
        '${ad}',
        '${data.hook}'
        )`;

  connection.query(sql, (err, result) => {
    if (err != null) {
      callback(-1);
    } else {
      const _id = typeof result === "undefined" ? -1 : result.insertId;

      let values = "";

      data.tags.forEach((t) => {
        values += (values.length < 1 ? "" : ",") + `(${_id},'${t}')`;
      });

      const query_tags = `INSERT ignore INTO codigo_has_tag (fk_codigo, fk_etiqueta) VALUES ${values};`;

      connection.query(query_tags, (err, __resp) => {
        callback(_id);
      });
    }

    connection.end();
  });
  //connection.query(` INSERT IGNORE INTO codigo_insert_session (hook) VALUES ('${data.hook}');`);
};

const obtener_codigos_bysubgrupo_opt = (idsubgrupo, callback) => {
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(
    "SELECT c.idcodigo AS 'value', c.codigo AS 'label' FROM codigo c WHERE c.subgrupo_idsubgrupo = " +
      idsubgrupo +
      ";",
    (err, rows, fields) => {
      return callback(rows);
    }
  );
  connection.end();
};

const obtener_codigos_categoria = (data, callback) => {
  const _query = `
    SELECT c.*, 
    if(c.modo_precio=0, (ROUND((c.costo * sg.multiplicador)/100)*100),if(c.modo_precio = 1,sg.precio_defecto,c.precio)) AS 'precio',
    sg.multiplicador, 
    sg.precio_defecto ,
    sg.precio_defecto_mayorista
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
  //console.log(_query)
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(_query, (err, rows) => {
    callback(rows);
  });
  connection.end();
};

const editar_codigo = (data, callback) => {
  const _codigo = data.codigo || "";
  if (_codigo == "") {
    console.log("No changes for code... returning 0 affected rows");
    callback(null, { affectedRows: 0 });
    return;
  }
  const connection = mysql_connection.getConnection();
  connection.connect();

  const query = `update codigo c set c.codigo=${connection.escape(_codigo)} 
    where c.idcodigo = ${data.idcodigo}`;

  connection.query(query, (err, resp) => {
    console.log("edit code response: ", resp);
    if (err) {
      console.log("error editing code: ", err);
      return callback(err, null);
    }
    callback(err, resp);
  });

  connection.end();
};

const editar_codigo_propiedades = (data, callback) => {
  console.log("trying to edit code.... ", data);
  //try to edit the code first
  editar_codigo(data, (_err, _resp) => {
    if (_err) {
    }
    const query = `update codigo c set 
        c.descripcion = '${data.descripcion}',
        c.modo_precio = '${data.modo_precio}',
        c.precio = ${data.precio}
        where c.idcodigo = ${data.idcodigo}
        `;
    const connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(query, (err, resp) => {
      console.log("==============finished trying to edit code.=============");
      //console.log(`${_resp.affectedRows>0 ? "Code modified" : "Code not modified"} and ${resp.affectedRows>0 ? "Properties modified" : "Properties not modified"}`);
      const _affectedRows1 = _resp ? _resp.affectedRows : 0;
      callback({
        modif_codigo: _affectedRows1 > 0,
        modif_prop: resp.affectedRows > 0,
        msg: _err ? "Código duplicado" : "",
      });
    });
    connection.end();
  });
};

const editar_lote_codigos = (params, callback) => {
  const _multiplier =
    params.porcentaje < 0 ? 0 : 1 + parseFloat(params.porcentaje) / 100.0;
  const _round = params.redondeo < 0 ? 1 : parseFloat(params.redondeo);
  const _precio = params.precio < 0 ? 0 : params.precio;

  const query1 = `UPDATE codigo c SET 
    c.subgrupo_idsubgrupo = ${params.idsubgrupo} 
    WHERE
    c.idcodigo IN (${params.idcodigos.toString()})`;

  const query2 = `UPDATE codigo c SET 
    c.modo_precio = ${params.modoPrecio} 
    WHERE
    c.idcodigo IN (${params.idcodigos.toString()})`;

  const query3 = `UPDATE codigo c SET 
    c.precio_ant = c.precio,
    c.precio = ${_precio} + truncate( (c.precio * ${_multiplier} ) / ${_round} , 0) * ${_round}
    WHERE
    c.idcodigo IN (${params.idcodigos.toString()})`;

  //console.log(query1)
  //console.log(query3)

  const connection = mysql_connection.getConnection();
  connection.connect();
  const queries = [];
  if (+params.idsubgrupo > 0) {
    queries.push(query1);
  }
  if (+params.modoPrecio > -1) {
    queries.push(query2);
  }
  if (+params.modificarPrecio > 0) {
    queries.push(query3);
  }

  const _doquery = (_) => {
    if (queries.length > 0) {
      connection.query(queries.pop(), (err, resp) => {
        _doquery();
      });
    } else {
      connection.end();
      callback({ msg: "OK" });
    }
  };

  _doquery();
};

const editar_cantidad_ideal = (params, callback) => {
  const query = `update codigo c set c.stock_ideal = ${params.stock_ideal} where c.idcodigo = ${params.idcodigo};`;
  //console.log(query)
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, (err, resp) => {
    callback(resp);
  });
  connection.end();
};

const cambiar_estado_activo = (params, callback) => {
  const { activo, codigos } = params;
  const connection = mysql_connection.getConnection();
  const q = `update codigo c set c.activo = '${activo}' where c.idcodigo in (${codigos});`;
  // console.log(q)
  // return
  connection.connect();
  connection.query(q, (err, response) => {
    if (err) {
      return callback({ err: 1 });
    }
    return callback(callback);
  });
  connection.end();
};

const ejemplo_codigo = (params, callback) => {
  const { idsubgrupo } = params;
  const query = `SELECT c1.codigo FROM
                    codigo c1 INNER JOIN 
                    (
                        SELECT MIN(c.idcodigo) AS 'id' 
                        FROM codigo c, subgrupo sg, grupo g
                        WHERE
                        c.subgrupo_idsubgrupo = sg.idsubgrupo AND 
                        sg.grupo_idgrupo = g.idgrupo AND 
                        (case when '${idsubgrupo}'<>'0' then sg.idsubgrupo='${idsubgrupo}' ELSE TRUE END )
                    ) mc
                    ON c1.idcodigo = mc.id
                    ;`;
  //console.log(query)
  const connection = mysql_connection.getConnection();
  connection.connect();
  connection.query(query, (err, response) => {
    
    if (err) {
      return callback({ err: 1 });
    }

    if (!response) {
      return callback("-");
    }

    if (typeof response.length === "undefined") {
      return callback("-");
    }

    if (response.length < 1) {
      return callback("-");
    }
console.log("ejemplo codigo response: ", JSON.stringify(response));
    return callback(response[0].codigo);
  });

  connection.end();
};

const agregar_codigos = (data, callback) => {
  /**
     * {
    "idsubgrupo": 67668,
    "codigos": [
        {
        "codigo": "asd",
        "descripcion": "asd",
        "precio": 0
        }
    ],
    "idsucursales": [
        15,
        6,
        7,
        8,
        9,
        11,
        12,
        13,
        14,
        16,
        10
    ],
    "cantidad_inicial": 0
    }
     */
  //TODO
  const query = `INSERT IGNORE INTO codigo (codigo, descripcion, subgrupo_idsubgrupo, costo, modo_precio, precio, hook, pending) VALUES ${data.codigos
    .map(
      (c) =>
        `('${c.codigo}','${c.descripcion}',${data.idsubgrupo},0,2,${
          parseFloat(c.precio)
        },'bulk_insert_${Date.now()}',1)`
    )
    .join(",")};`;
  //console.log(query);
  doQuery(query, (err, resp) => {
    if (err) {
      console.log("Error inserting bulk codes: ", err);
      return callback({ err: 1 });
    }
    callback(resp);
  });
};

module.exports = {
  agregar_codigos,
  editar_cantidad_ideal,
  editar_codigo_propiedades,
  obtener_codigos,
  agregar_codigo,
  obtener_codigos_bysubgrupo_opt,
  search_codigos,
  obtener_codigo_por_id,
  obtener_codigo,
  obtener_codigos_categoria,
  obtener_codigos_filtros,
  editar_lote_codigos,
  cambiar_estado_activo,
  ejemplo_codigo,
};
