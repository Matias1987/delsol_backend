const { doTransaction, doQuery } = require("./helpers/queriesHelper");

const lista_pedidos = (data, callback) => {
  const query = `SELECT 
    p.idpedido,
    p.tipo,
    p.sucursal_origen,
    p.sucursal_pedido,
    p.proveedor_idproveedor,
    p.fecha,
    p.cant_total_pedida,
    p.cant_total_recibida,
    p.comentarios
FROM pedido p
ORDER BY p.fecha DESC;
`;
  doQuery(query, (response) => {
    callback(response.data);
  });
};
const detalle_pedido = ({ idpedido }, callback) => {
  const query = `SELECT 
    p.idpedido,
    p.tipo,
    p.fecha,
    p.comentarios AS pedido_comentarios,
    phc.codigo_idcodigo,
    phc.cant_pedida,
    phc.cant_recibida,
    phc.comentarios AS item_comentarios
FROM pedido p
JOIN pedido_has_codigo phc 
    ON p.idpedido = phc.pedido_idpedido
WHERE p.idpedido = ${idpedido};
`;
  doQuery(query, (response) => {
    callback(response.data);
  });
};

const insert_pedido_only = () => {
  const q_a_proveedores = `INSERT INTO pedido (
    sucursal_origen,
    usuario_idusuario,
    tipo,
    proveedor_idproveedor,
    sucursal_pedido,
    fecha,
    cant_total_pedida,
    cant_total_recibida,
    comentarios
) VALUES (
    1,                -- sucursal_origen (FK to sucursal.idsucursal)
    10,               -- usuario_idusuario (FK to usuario.idusuario)
    'COMPRA',         -- tipo (ej: 'COMPRA' o 'VENTA')
    5,                -- proveedor_idproveedor (FK to proveedor.idproveedor)
    2,                -- sucursal_pedido (FK to sucursal.idsucursal)
    NOW(),            -- fecha (current datetime)
    100,              -- cant_total_pedida
    0,                -- cant_total_recibida
    'Pedido inicial'  -- comentarios
);
`;

  const q_interno = `INSERT INTO pedido (
    sucursal_origen,
    usuario_idusuario,
    tipo,
    proveedor_idproveedor,
    sucursal_pedido,
    fecha,
    cant_total_pedida,
    cant_total_recibida,
    comentarios
) VALUES (
    1,                -- sucursal_origen (ej: sucursal principal)
    12,               -- usuario_idusuario (ej: responsable del pedido)
    'INTERNO',        -- tipo (pedido interno)
    NULL,             -- proveedor_idproveedor (no aplica)
    3,                -- sucursal_pedido (sucursal destino)
    NOW(),            -- fecha
    50,               -- cant_total_pedida
    0,                -- cant_total_recibida
    'Transferencia interna de stock'
);
`;
};

const agregar_producto_a_envio = () => {
  const query = `INSERT INTO pedido_has_codigo (
    pedido_idpedido,
    codigo_idcodigo,
    cant_pedida,
    cant_recibida,
    comentarios
) VALUES (
    1,               -- pedido_idpedido (FK a pedido.idpedido)
    101,             -- codigo_idcodigo (FK a codigo.idcodigo)
    20,              -- cant_pedida
    0,               -- cant_recibida
    'Pendiente de recepción'
);
`;
};
const eliminar_producto_de_envio = () => {
  const query = `INSERT INTO pedido_has_codigo (
    pedido_idpedido,
    codigo_idcodigo,
    cant_pedida,
    cant_recibida,
    comentarios
) VALUES (
    1,               -- pedido_idpedido (FK a pedido.idpedido)
    101,             -- codigo_idcodigo (FK a codigo.idcodigo)
    20,              -- cant_pedida
    0,               -- cant_recibida
    'Pendiente de recepción'
);
`;
};

const insert_pedido = (
  {
    sucursal_origen,
    usuario_idusuario,
    tipo,
    proveedor_idproveedor,
    sucursal_pedido,
    cant_total_pedida,
    comentarios,
    items, // array: [{codigo_idcodigo, cant_pedida, comentarios}]
  },
  callback,
) => {
  const logic = async (connection) => {
    const [pedidoResult] = await connection.query(
      `INSERT INTO pedido (
        sucursal_origen, usuario_idusuario, tipo,
        proveedor_idproveedor, sucursal_pedido,
        cant_total_pedida, cant_total_recibida, comentarios
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sucursal_origen,
        usuario_idusuario,
        tipo,
        proveedor_idproveedor || null,
        sucursal_pedido || null,
        cant_total_pedida || null,
        0, // cant_total_recibida inicial
        comentarios || null,
      ],
    );

    const pedidoId = pedidoResult.insertId;

    // 2. Insert items into pedido_has_codigo
    for (const item of items) {
      await connection.query(
        `INSERT INTO pedido_has_codigo (
          pedido_idpedido, codigo_idcodigo,
          cant_pedida, cant_recibida, comentarios
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          pedidoId,
          item.codigo_idcodigo,
          item.cant_pedida,
          0, // cant_recibida inicial
          item.comentarios || null,
        ],
      );
    }

    return pedidoId;
  };

  doTransaction(logic, (response) => {
    callback(response);
  });
};

const actualizar_pedido = ({ pedidoId, items }, callback) => {
  const logic = async (connection) => {
    let totalRecibida = 0;

    // 1. Actualizar cada producto en pedido_has_codigo
    for (const item of items) {
      await connection.query(
        `UPDATE pedido_has_codigo
         SET cant_recibida = ?
         WHERE pedido_idpedido = ? AND codigo_idcodigo = ?`,
        [item.cant_recibida, pedidoId, item.codigo_idcodigo],
      );

      totalRecibida += item.cant_recibida;
    }

    // 2. Actualizar el pedido con el total recibido
    await connection.query(
      `UPDATE pedido
       SET cant_total_recibida = ?
       WHERE idpedido = ?`,
      [totalRecibida, pedidoId],
    );
  };

  doTransaction(logic, (response) => {
    callback(response);
  });
};
const revertir_recepcion_parcial = ({ pedidoId, items }, callback) => {
  const logic = async (connection) => {
    let totalRevertida = 0;

    // 1. Restar cantidades recibidas en cada producto
    for (const item of items) {
      await connection.query(
        `UPDATE pedido_has_codigo
         SET cant_recibida = GREATEST(COALESCE(cant_recibida,0) - ?, 0)
         WHERE pedido_idpedido = ? AND codigo_idcodigo = ?`,
        [item.cant_revertida, pedidoId, item.codigo_idcodigo],
      );

      totalRevertida += item.cant_revertida;
    }

    // 2. Restar del total recibido en el pedido
    await connection.query(
      `UPDATE pedido
       SET cant_total_recibida = GREATEST(COALESCE(cant_total_recibida,0) - ?, 0)
       WHERE idpedido = ?`,
      [totalRevertida, pedidoId],
    );
  };

  doTransaction(logic, (response) => {
    callback(response);
  });
};
const incrementar_cant_pedido = ({ pedidoId, items }, callback) => {
  const logic = async (connection) => {
    let totalRecibida = 0;

    // 1. Actualizar cada producto sumando la cantidad recibida
    for (const item of items) {
      await connection.query(
        `UPDATE pedido_has_codigo
         SET cant_recibida = COALESCE(cant_recibida,0) + ?
         WHERE pedido_idpedido = ? AND codigo_idcodigo = ?`,
        [item.cant_recibida, pedidoId, item.codigo_idcodigo],
      );

      totalRecibida += item.cant_recibida;
    }

    // 2. Actualizar el pedido sumando al total recibido
    await connection.query(
      `UPDATE pedido
       SET cant_total_recibida = COALESCE(cant_total_recibida,0) + ?
       WHERE idpedido = ?`,
      [totalRecibida, pedidoId],
    );
  };

  doTransaction(logic, (response) => {
    callback(response);
  });
};

const cambiar_estado_pedido = ({ nuevoEstado, pedidoId }, callback) => {
  const logic = async (connection) => {
    const [result] = await connection.query(
      `UPDATE pedido
       SET estado = ?
       WHERE idpedido = ?`,
      [nuevoEstado, pedidoId],
    );

    if (result.affectedRows === 0) {
      throw new Error("Pedido no encontrado");
    }

    return result.affectedRows;
  };

  doTransaction(logic, (response) => {
    callback(response);
  });
};
const productos_pedidos_pendientes = ({ pedidoId }, callback) => {
  const logic = async (connection) => {
    const [rows] = await connection.query(
      `SELECT 
         p.idpedido,
         p.estado,
         p.fecha,
         phc.codigo_idcodigo,
         phc.cant_pedida,
         phc.cant_recibida,
         phc.comentarios AS item_comentarios
       FROM pedido p
       JOIN pedido_has_codigo phc 
         ON p.idpedido = phc.pedido_idpedido
       WHERE p.estado = 'Pendiente'
       ORDER BY p.fecha DESC`,
    );

    return rows;
  };

  doTransaction(logic, (response) => {
    callback(response);
  });
};

/*++++++++++++++++++++++++++*/
/*INFORMES*/
/*++++++++++++++++++++++++++*/

module.exports = {
  insert_pedido,
  actualizar_pedido,
  incrementar_cant_pedido,
  revertir_recepcion_parcial,
  lista_pedidos,
  detalle_pedido,
  cambiar_estado_pedido,
  productos_pedidos_pendientes,
};
