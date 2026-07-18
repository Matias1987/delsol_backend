const {
  usar_stock_sucursal_central,
  id_subgrupo_cristales,
} = require("../lib/global");
const { doQuery } = require("./helpers/queriesHelper");
const { queriesStockCristales } = require("./queries/stockCristalesQueries");

const guardar_stock_cristales = (data, callback) => {
  const base_query = `INSERT INTO stock_cristales  (fk_codigo, fk_sucursal, esf, cil, cantidad) VALUES `;

  let rows_str = "";

  data.cells_neg.forEach((c) => {
    rows_str +=
      (rows_str.length > 0 ? "," : "") +
      `(${data.fk_codigo},${data.fk_sucursal},'${c.esf}','-${c.cil}', ${c.cantidad})`;
  });

  data.cells_pos.forEach((c) => {
    rows_str +=
      (rows_str.length > 0 ? "," : "") +
      `(${data.fk_codigo},${data.fk_sucursal},'${c.esf}','-${c.cil}', ${c.cantidad})`;
  });

  rows_str += ` ON DUPLICATE KEY UPDATE cantidad= VALUES(cantidad);`;

  //console.log(base_query + rows_str);
  //return callback?.({ok:1});

  doQuery(base_query + rows_str, (response) => {
    callback?.(response.data);
  });
};

const obtener_stock = (data, callback) => {
  const query = `select * from stock_cristales s where s.fk_sucursal = ${data.fk_sucursal} and `;
  let codigos = "";
  if (!data.codigos || data.codigos.length == 0) {
    console.log(
      "No se proporcionaron codigos para obtener stock de cristales.",
    );
    return callback?.({
      ok: 0,
      message: "No se proporcionaron codigos para obtener stock de cristales",
    });
  }
  data.codigos.forEach((c) => {
    codigos +=
      (codigos.length > 0 ? " or " : "") +
      `(s.fk_codigo=${c.idcodigo} and s.esf='${c.esf}' and s.cil='${c.cil}')`;
  });
  console.log("Query to obtain stock for cristales:");
  console.log(query + codigos);

  doQuery(query + codigos, (response) => {
    callback?.(response.data);
  });
};

const obtener_grilla = ({ fkCodigo, fkSucursal }, callback) => {
  const query = `select * from stock_cristales s where s.fk_codigo=${fkCodigo} and s.fk_sucursal= ${fkSucursal};`;
  console.log(query);
  doQuery(query, (response) => {
    callback?.(response.data);
  });
};

const obtener_codigos_cristales = (callback) => {
  const query = `SELECT * FROM codigo c WHERE c.subgrupo_idsubgrupo=${id_subgrupo_cristales};`;
  doQuery(query, (response) => {
    callback?.(response.data);
  });
};

const acutalizar_stock_cristales = (data, callback) => {
  const idsucursal = data.fk_sucursal;
  console.log(
    "###################Updating stock for cristales with data:################################",
  );
  //console.log(data);
  /*
  const query = `UPDATE stock_cristales sc SET 
      sc.cantidad=sc.cantidad-${data.cantidad} 
      WHERE 
      sc.fk_sucursal=${idsucursal} AND 
      sc.fk_codigo=${data.idcodigo} AND 
      sc.esf='${parseFloat(data.esf) == 0 ? "0.00" : data.esf}' AND 
      sc.cil='${parseFloat(data.cil) == 0 ? "-0.00" : data.cil}' AND 
      sc.side='${data.side || "-"}';`;*/
  
  const query = `UPDATE stock_cristales sc SET 
      sc.cantidad=sc.cantidad-${data.cantidad} 
      WHERE 
      sc.fk_sucursal=${idsucursal} AND 
      sc.fk_codigo=${data.idcodigo} AND 
      sc.esf='${ parseFloat(data.esf) == 0 ? '0.00' : parseFloat(data.esf).toFixed(2)}' AND 
      sc.cil='${ parseFloat(data.cil) == 0 ? '-0.00' : data.cil}' ;`;

  console.log(query);

  doQuery(query, (updateResponse) => {
    if (!updateResponse) {
      console.log("Error al actualizar el stock de cristales:");
      return callback?.({
        ok: 0,
        message: "Error al actualizar el stock de cristales",
        details: "Error al ejecutar la consulta de actualización",
      });
    }

    return callback?.({
      ok: 1,
      message: "Stock de cristales actualizado correctamente",
    });
  });
  /*
  obtener_stock(
    { fk_sucursal: data.fk_sucursal, codigos: data.codigos },
    (response) => {
      if (!response) {
        console.log(
          "Error: No se pudo obtener el stock de cristales para actualizar.",
        );
        return callback?.({
          ok: 0,
          message: "Error al obtener el stock para actualizar",
        });
      }
      if (response.length === 0) {
        console.log(
          "No se encontraron registros de stock para los cristales solicitados para actualizar.",
        );
        return callback?.({
          ok: 0,
          message:
            "No se encontró stock para los cristales solicitados para actualizar",
        });
      }
    },
  );*/
};

/****
 *
 */

const obtener_stock_cristales_v2 = async (data, connection) => {
  if (!data.codigos || data.codigos.length == 0) {
    console.log(
      "No se proporcionaron codigos para obtener stock de cristales.",
    );
    return {
      error: true,
      message: "No se proporcionaron codigos para obtener stock de cristales",
    };
  }

  const query = `select * from stock_cristales s where s.fk_sucursal = ${data.fk_sucursal} and `;
  let codigos = "";

  data.codigos.forEach((c) => {
    codigos +=
      (codigos.length > 0 ? " or " : "") +
      `(s.fk_codigo=${c.idcodigo} and s.esf='${c.esf}' and s.cil='${c.cil}')`;
  });
  //console.log("Query to obtain stock for cristales:");
  //console.log(query + codigos);

  const resp = await connection.query(query + codigos);
  return { error: false, data: resp[0] };
};

const acutalizar_stock_cristales_v2 = async (data, connection) => {
  const q = `UPDATE stock_cristales sc SET 
      sc.cantidad=sc.cantidad-${data.cantidad} 
      WHERE 
      sc.fk_sucursal=${data.fksucursal} AND 
      sc.fk_codigo=${data.idcodigo} AND 
      sc.esf='${parseFloat(data.esf) == 0 ? "0.00" : data.esf}' AND 
      sc.cil='${parseFloat(data.cil) == 0 ? "-0.00" : data.cil}' AND 
      sc.side='${data.side || "-"}';`;
  console.log("Executing query to update stock for cristales:");
  console.log(q);
  return await connection.query(q);
};

const obtener_ventas_cristales = async (data, connection) => {
  const query = queriesStockCristales.obtener_ventas_cristales(data);
  return await connection.query(query);
};

const restaurar_cantidades_venta = async (data, connection) => {
  const query = queriesStockCristales.restaurar_cantidades_venta(data) ;
  return await connection.query(query);
};

module.exports = {
  guardar_stock_cristales,
  obtener_grilla,
  obtener_stock,
  obtener_codigos_cristales,
  acutalizar_stock_cristales,
  obtener_stock_cristales_v2,
  acutalizar_stock_cristales_v2,
  obtener_ventas_cristales,
  restaurar_cantidades_venta,
};
