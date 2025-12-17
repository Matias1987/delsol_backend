const { doQuery } = require("./helpers/queriesHelper");

const agregarStock = ({codigo, descripcion, precio, idsubgrupo},callback) =>{
    const query1 = `insert into codigo (subgrupo_idsubgrupo, codigo, descripcion, precio, modo_precio) values ('${idsubgrupo}','${codigo}','${descripcion}','${precio}',1)`;

    doQuery(query1,(response)=>{
        console.log(`INSERT INTO stock (sucursal_idsucursal, codigo_idcodigo, cantidad) (SELECT s0.idsucursal,${response.data.insertId},0 FROM sucursal s0);`);
        doQuery(`INSERT INTO stock (sucursal_idsucursal, codigo_idcodigo, cantidad) (SELECT s0.idsucursal,${response.data.insertId},0 FROM sucursal s0);`,
            (_response)=>{
                console.log(JSON.stringify(response.data))
                return callback({idcodigo:response.data.insertId, codigo: codigo, msg:"Stock added...."})
            }
        )
    })

}

module.exports = {agregarStock}