const { response } = require("express");
const { doTransaction } = require("./helpers/queriesHelper");
/**
 * 
 * url: http://localhost:3001/api/v1/operaciones/
 * 
 * payload example:
   {
      id: 1,
      codigo: "AB7K9",
      clienteNombre: "Juan Perez",
      vendedorNombre: "Bruno",
      sucursalNombre: "Resistencia Centro",
      datosDni: {
        numeroDocumento: "35222111",
        apellido: "Perez",
        nombre: "Juan",
      },
      datosReceta: {
        success: true,
        data: {
          paciente_nombre: null,
          medico_nombre: "Maria Laura Campi",
          graduacion_lejos: {
            ojo_derecho: {
              esfera: "-2.50",
              cilindro: "-1.00",
              eje: "90",
            },
            ojo_izquierdo: {
              esfera: "-3.75",
              cilindro: "-1.00",
              eje: "80",
            },
            dp: null,
          },
          graduacion_cerca: {
            ojo_derecho: {
              esfera: null,
              cilindro: null,
              eje: null,
            },
            ojo_izquierdo: {
              esfera: null,
              cilindro: null,
              eje: null,
            },
            dp: null,
          },
          adicion: "+1.50",
          tipo_lente: null,
          observaciones: null,
        },
      },
      estado: "PENDIENTE",
      fechaCreacion: "20/11/2026 14:35",
    },

 */
const insert = (data, callback) => {
  const {
    codigo,
    vendedorId,
    sucursalId,
    clienteNombre,
    datosDni,
    datosReceta,
    estado,
  } = data;

  console.log(JSON.stringify(data));

  // Validación básica de campos obligatorios (NOT NULL en la tabla)
  if (!codigo || vendedorId == null || sucursalId == null) {
    return callback({ error: 1 });
  }

  const sql = `
      INSERT INTO operaciones_movil (
        codigo,
        usuario_id,
        sucursal_id,
        cliente_nombre,
        datos_dni,
        datos_receta,
        estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

  const values = [
    codigo,
    vendedorId,
    sucursalId,
    clienteNombre || null,
    datosDni ? JSON.stringify(datosDni) : null,
    datosReceta ? JSON.stringify(datosReceta) : null,
    estado || "PENDIENTE",
  ];

  //doTransaction is a helper with a try catch block.
  doTransaction(
    async (connection) => {
      console.log(connection.format(sql, values));
      await connection.query(sql, values);
    },
    (response) => {
      callback(response.data);
    },
  );
};

// 2. OBTENER LISTADO (GET)
// Soporta filtros opcionales por query: ?sucursalId=16&estado=PENDIENTE
const listarOperacionesMovil = (data, callback) => {
  const { sucursalId, estado, usuarioId } = data;

  const logic = async (connection) => {
    let sql = `
      SELECT 
        id,
        codigo,
        usuario_id AS vendedorId,
        sucursal_id AS sucursalId,
        cliente_nombre AS clienteNombre,
        'Carlos' AS vendedorNombre,
        datos_dni AS datosDni,
        datos_receta AS datosReceta,
        estado,
        DATE_FORMAT(fecha_creacion, '%d/%m/%Y %H:%i') AS fechaCreacion,
        DATE_FORMAT(fecha_actualizacion, '%d/%m/%Y %H:%i') AS fechaActualizacion
      FROM operaciones_movil
      WHERE 1=1
    `;

    const params = [];

    if (sucursalId) {
      sql += " AND sucursal_id = ?";
      params.push(sucursalId);
    }

    if (usuarioId) {
      sql += " AND usuario_id = ?";
      params.push(usuarioId);
    }

    // Si no se envía estado, por defecto podrías traer solo las PENDIENTE o todas
    if (estado) {
      sql += " AND estado = ?";
      params.push(estado);
    }

    sql += " ORDER BY fecha_creacion DESC";

    const [rows] = await connection.query(sql, params);
    // Asegurar que las columnas JSON se devuelvan como objetos y no como strings
    const dataFormateada = rows.map((row) => ({
      ...row,
      datosDni:
        typeof row.datosDni === "string"
          ? JSON.parse(row.datosDni)
          : row.datosDni,
      datosReceta:
        typeof row.datosReceta === "string"
          ? JSON.parse(row.datosReceta)
          : row.datosReceta,
    }));

    return dataFormateada;
  };

  doTransaction(logic, (response) => {
    callback(response.data);
  });
};

const cambiarEstadoOperacion = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado || !ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({
      success: false,
      message: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(", ")}`,
    });
  }

  const sql = `
      UPDATE operaciones_movil
      SET estado = ?
      WHERE id = ?
    `;

  const [result] = await pool.execute(sql, [estado, id]);

  if (result.affectedRows === 0) {
    return callback({
      success: false,
      message: `No se encontró la operación con ID ${id}.`,
    });
  }

  return callback({
    success: true,
    message: `Estado actualizado a ${estado}`,
    data: { id: Number(id), estado },
  });
};

const obtenerVendedores = (callback) => {
  doTransaction(
    async (connection) => {
      const data = await connection.query("SELECT u.idusuario AS id, u.nombre FROM usuario u;");
      return data[0];
    },
    (response) => {
      callback(response.data);
    },
  );
};

const obtenerSucursales = (callback) => {
  doTransaction(
    async (connection) => {
      const data = await connection.query("SELECT s.idsucursal AS id, s.nombre FROM sucursal s ;")
      return data[0];
    },
    (response) => {
      callback(response.data);
    },
  );
};

module.exports = {
  insert,
  listarOperacionesMovil,
  cambiarEstadoOperacion,
  obtenerSucursales,
  obtenerVendedores,
};
