const CodigoDB = require("../database/Codigo");
const StockDB = require("../database/Stock");
const search_codigos = (data, callback) => {
  CodigoDB.search_codigos(data, (rows) => {
    return callback(rows);
  });
};

const obtenerCodigoPorID = (idcodigo, callback) => {
  CodigoDB.obtener_codigo_por_id(idcodigo, (rows) => {
    return callback(rows);
  });
};

const obtenerCodigo = (codigo, callback) => {
  CodigoDB.obtener_codigo(codigo, (rows) => {
    return callback(rows);
  });
};
const obtenerCodigos = (callback) => {
  CodigoDB.obtener_codigos((rows) => {
    return callback(rows);
  });
};
const agregarCodigo = (data, callback) => {
  CodigoDB.agregar_codigo(data, (id) => {
    return callback(id);
  });
};
const editarCodigo = (req, res) => {};

const obtener_codigos_bysubgrupo_opt = (idsubgrupo, callback) => {
  CodigoDB.obtener_codigos_bysubgrupo_opt(idsubgrupo, (rows) => {
    return callback(rows);
  });
};

const obtener_codigos_categoria = (data, callback) => {
  CodigoDB.obtener_codigos_categoria(data, (rows) => {
    return callback(rows);
  });
};

const editar_codigo_propiedades = (data, callback) => {
  CodigoDB.editar_codigo_propiedades(data, (response) => {
    return callback(response);
  });
};

const obtener_codigos_filtros = (data, callback) => {
  CodigoDB.obtener_codigos_filtros(data, (rows) => {
    return callback(rows);
  });
};

const editar_lote_codigos = (data, callback) => {
  CodigoDB.editar_lote_codigos(data, (resp) => {
    return callback(resp);
  });
};

const editar_cantidad_ideal = (data, callback) => {
  CodigoDB.editar_cantidad_ideal(data, (resp) => {
    return callback(resp);
  });
};

const cambiar_estado_activo = (data, callback) => {
  CodigoDB.cambiar_estado_activo(data, (response) => {
    return callback(response);
  });
};

const ejemplo_codigo = (data, callback) => {
  CodigoDB.ejemplo_codigo(data, (response) => {});
};

const agregar_codigos = (data, callback) => {
  CodigoDB.agregar_codigos(data, (resp) => {
    StockDB.distribuir_cantidad_a_sucursales(
      {
        idsubgrupo: typeof data.idsubgrupo === 'undefined' ? 0 : data.idsubgrupo,
        idgrupo: typeof data.idgrupo === 'undefined' ? 0 : data.idgrupo,
        idsubfamilia: typeof data.idsubfamilia === 'undefined' ? 0 : data.idsubfamilia,
        idfamilia: typeof data.idfamilia === 'undefined' ? 0 : data.idfamilia,
        cantidad: data.cantidad,
        idsucursales: data.idsucursales,
      },
      (response) => {
        callback(resp);
      }
    );
  });
};

module.exports = {
  agregar_codigos,
  editar_cantidad_ideal,
  editar_lote_codigos,
  obtener_codigos_filtros,
  editar_codigo_propiedades,
  obtenerCodigoPorID,
  obtenerCodigos,
  agregarCodigo,
  editarCodigo,
  obtener_codigos_bysubgrupo_opt,
  search_codigos,
  obtenerCodigo,
  obtener_codigos_categoria,
  cambiar_estado_activo,
  ejemplo_codigo,
};
