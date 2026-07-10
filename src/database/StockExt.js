const { doQuery } = require("./helpers/queriesHelper");

const agregarStock = (
  { codigo, descripcion, precio, idsubgrupo },
  callback,
) => {
  const query1 = `insert ignore into codigo (subgrupo_idsubgrupo, codigo, descripcion, precio, modo_precio) values ('${idsubgrupo}','${codigo}','${descripcion}','${precio}',1)`;

  doQuery(query1, (response) => {
    //console.log(`INSERT INTO stock (sucursal_idsucursal, codigo_idcodigo, cantidad) (SELECT s0.idsucursal,${response.data.insertId},0 FROM sucursal s0);`);
    doQuery(
      `INSERT ignore INTO stock (sucursal_idsucursal, codigo_idcodigo, cantidad) (SELECT s0.idsucursal,${response.data.insertId},0 FROM sucursal s0);`,
      (_response) => {
        if (response.data.warningStatus > 0) {
          console.log("Duplicate entry ignored, warning issued.");
          return callback({ idcodigo: -1, codigo: "", msg: "DUPLICATED" });
        }
        //console.log(JSON.stringify(response.data))
        return callback({
          idcodigo: response.data.insertId,
          codigo: codigo,
          msg: "Stock added....",
        });
      },
    );
  });
};

const verificar_cantidades_productos_v2 = async (
  { data, ignore_cristales },
  connection,
) => {
  //console.log(JSON.stringify(data));

  const doPush = (idx, obj, _arr) =>
    !obj.hasOwnProperty(idx)
      ? _arr
      : obj[idx] == null
        ? _arr
        : obj[idx].codigo == null || +obj[idx].idcodigo < 0
          ? _arr
          : [..._arr, obj[idx]];
  const productos = data.productos;

  var arr = [];
  switch (+data.tipo) {
    case 1: //DIRECTA
      console.log("venta directa... adding");
      productos.forEach((p) => {
        arr.push(p);
      });
      break;
    case 2: //REC STOCK
      if (!ignore_cristales) {
        arr = doPush("lejos_od", productos, arr);
        arr = doPush("lejos_oi", productos, arr);
        arr = doPush("cerca_od", productos, arr);
        arr = doPush("cerca_oi", productos, arr);
      }
      arr = doPush("lejos_armazon", productos, arr);
      arr = doPush("cerca_armazon", productos, arr);
      arr = doPush("lejos_tratamiento", productos, arr);
      arr = doPush("cerca_tratamiento", productos, arr);
      break;
    case 3: //LC STOCK
      arr = doPush("od", productos, arr);
      arr = doPush("oi", productos, arr);
      arr = doPush("insumo", productos, arr);
      break;
    case 4: //MONOF LAB
      arr = doPush("lejos_armazon", productos, arr);
      arr = doPush("cerca_armazon", productos, arr);
      arr = doPush("lejos_tratamiento", productos, arr);
      arr = doPush("cerca_tratamiento", productos, arr);
      break;
    case 5: //MULTIF
      arr = doPush("od", productos, arr);
      arr = doPush("oi", productos, arr);
      arr = doPush("tratamiento", productos, arr);
      arr = doPush("armazon", productos, arr);
      break;
    case 6: //LCLAB
      arr = doPush("insumo", productos, arr);
      break;
  }
  //console.log(JSON.stringify(arr))
  var codigos = [];
  arr.forEach((r) => {
    const temp = codigos.find((c) => c.idcodigo == r.idcodigo);
    if (typeof temp !== "undefined") {
      codigos = codigos.map((t) => ({
        ...t,
        cantidad:
          t.idcodigo == r.idcodigo ? t.cantidad + r.cantidad : t.cantidad,
      }));
    } else {
      codigos.push({
        idcodigo: r.idcodigo,
        cantidad: r.cantidad,
        cantidad_serv: -1,
      });
    }
  });

  var ids = "";

  codigos.forEach((c) => {
    ids += (ids.length > 0 ? "," : "") + `${c.idcodigo}`;
  });

  var query = `SELECT 
  s.codigo_idcodigo AS 'idcodigo', 
  s.cantidad, 
  c.codigo 
  FROM 
  stock s, 
  codigo c 
  WHERE 
  c.idcodigo = s.codigo_idcodigo and 
  s.sucursal_idsucursal = ${data.fksucursal} AND 
  s.codigo_idcodigo IN (${ids})`;

  if (ids.length < 1) {
    query = `select true; `;
  }

  //console.log(query);

  const resp = await connection.query(query);

  //console.log(JSON.stringify(resp[0]))

  const rows = resp[0];
  // check if there are codes with less than the required quantity!
  var error = 0;

  var c = null;
  if (rows) {
    rows.forEach((r) => {
      for (let i = 0; i < codigos.length; i++) {
        if (codigos[i].idcodigo == r.idcodigo) {
          codigos[i].cantidad_serv = r.cantidad;
          codigos[i].codigo = r.codigo;
        }
      }
    });
    //console.log(JSON.stringify(codigos));
    for (let i = 0; i < codigos.length; i++) {
      if (codigos[i].cantidad > codigos[i].cantidad_serv) {
        c = codigos[i];
        error = 1;
        break;
      }
    }
  }
  //console.log(JSON.stringify({ error: error, ref: c }));
  return { error: error, ref: c };
};

module.exports = { agregarStock, verificar_cantidades_productos_v2 };
