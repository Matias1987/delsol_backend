const mysql_connection = require("../../lib/mysql_connection");
const pool = require("../../lib/spool");
module.exports = {
  /*doQuery: (query, callback) => {
        const connection = mysql_connection.getConnection()
        connection.connect()
        connection.query(query,(err,resp)=>{
            if(err)
            {
                return callback?.({err})
            }

            callback?.({data:resp})
        });
        connection.end();
    },*/

  doQuery: async (query, callback) => {
    try {
      const [rows, fields] = await pool.query(query);
      callback?.({ data: rows });
    } catch (error) {
      callback?.({ err: error });
    }
  },

  // NUEVO MÉTODO DINÁMICO: Permite lógica intermedia entre consultas
  doTransaction: async (transactionLogicFn, callback) => {
    // 1. Obtener la conexión exclusiva del pool
    const connection = await pool.getConnection();
    
    try {
      // 2. Iniciar la transacción
      await connection.beginTransaction();

      // 3. Ejecutar la lógica personalizada pasando la conexión como herramienta
      const result = await transactionLogicFn(connection);

      // 4. Si la lógica interna termina sin errores, confirmamos cambios
      await connection.commit();
      callback?.({ data: result });

    } catch (error) {
      // 5. Si algo falló en cualquier paso de la lógica, revertimos todo
      await connection.rollback();
      callback?.({ err: error });

    } finally {
      // 6. Liberar la conexión pase lo que pase
      connection.release();
    }
  },

  escapeHelper: (val) => {
    if (val === null || val === undefined) return "NULL";

    switch (typeof val) {
      case "number":
        return val.toString();
      case "boolean":
        return val ? "TRUE" : "FALSE";
      case "object":
        if (val instanceof Date) {
          return `'${val.toISOString().slice(0, 19).replace("T", " ")}'`;
        }
        return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
      default: // string
        return `'${val.replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
    }
  },
};


/*
EJEMPLO DE USO DE CODIGO
app.post('/api/crear-pedido', (req, res) => {
  const { usuarioId, total, productos } = req.body; // productos es un array

  // Definimos la lógica dinámica que se ejecutará DENTRO de la transacción
  const miLogicaDeNegocio = async (connection) => {
    // Consulta 1: Insertar el pedido principal
    const [resPedido] = await connection.query(
      'INSERT INTO pedidos (usuario_id, total, fecha) VALUES (?, ?, NOW())',
      [usuarioId, total]
    );

    // CAPTURA DE DATOS ANTERIORES: Obtenemos el ID autogenerado por MySQL
    const nuevoPedidoId = resPedido.insertId;

    // Consulta 2: Usar ese ID para insertar los productos relacionados
    for (const producto of productos) {
      await connection.query(
        'INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)',
        [nuevoPedidoId, producto.id, producto.cantidad, producto.precio]
      );
    }

    // Retornamos lo que queremos recibir en el callback final
    return { pedidoId: nuevoPedidoId };
  };

  // Ejecutamos la transacción pasándole la función lógica
  db.doTransaction(miLogicaDeNegocio, ({ data, err }) => {
    if (err) {
      console.error("Error en la transacción. Rollback aplicado:", err);
      return res.status(500).json({ error: "No se pudo procesar el pedido de forma segura" });
    }

    // 'data' contiene el objeto retornado { pedidoId: ... }
    res.status(201).json({ mensaje: "Pedido creado con éxito", pedidoId: data.pedidoId });
  });
});

*/