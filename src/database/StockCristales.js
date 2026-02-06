const { doQuery } = require("./helpers/queriesHelper");

const guardar_stock_cristales = (data, callback) => {

    const base_query = `INSERT INTO stock_cristales  (fk_codigo, fk_sucursal, esf, cil, cantidad) VALUES `;

    let rows_str = "";

    data.cells.forEach(c => {
        rows_str += (rows_str.length > 0 ? "," : "") + `(${data.fk_codigo},${data.fk_sucursal},'${data.tipo_grilla == 'positivo' ? `+` : `-`}${c.esf}','-${c.cil}', ${c.cantidad})`;
    });

    rows_str +=` ON DUPLICATE KEY UPDATE cantidad= VALUES(cantidad);`

    console.log(base_query + rows_str);
    //return callback?.({ok:1});
    
    doQuery(base_query + rows_str,(response)=>{
        callback?.(response.data);
    })
}

const obtener_stock = (data, callback) => {
    const query = `select * from stock_cristales s where s.fk_sucursal = 0 and `
    let codigos = "";
    data.codigos.forEach(c=>{
        codigos += (codigos.length>0 ? ' or ':'') + `(s.fk_codigo=${c.idcodigo} and s.esf=${c.esf} and s.cil='${c.cil}')`;
    });
    doQuery(query,(response)=>{
        callback?.(response.data);
    })
}

const obtener_grilla = ({fkCodigo, fkSucursal}, callback) => {
    const query = `select * from stock_cristales s where s.fk_codigo=${fkCodigo} and s.fk_sucursal= ${fkSucursal};`;
    doQuery(query,(response)=>{
        callback?.(response.data);
    });
}

const obtener_codigos_cristales = (callback) => {
    const query = `SELECT * FROM codigo c WHERE c.subgrupo_idsubgrupo=67689;`;
    doQuery(query,(response)=>{
        callback?.(response.data);
    })
}

module.exports = {guardar_stock_cristales,obtener_grilla, obtener_stock, obtener_codigos_cristales}