const { doQuery } = require("./helpers/queriesHelper");

const agregarStock = ({codigo, descripcion, precio, idsubgrupo},callback) =>{
    const query1 = `insert ignore into codigo (subgrupo_idsubgrupo, codigo, descripcion, precio, modo_precio) values ('${idsubgrupo}','${codigo}','${descripcion}','${precio}',1)`;

    doQuery(query1,(response)=>{
        //console.log(`INSERT INTO stock (sucursal_idsucursal, codigo_idcodigo, cantidad) (SELECT s0.idsucursal,${response.data.insertId},0 FROM sucursal s0);`);
        doQuery(`INSERT ignore INTO stock (sucursal_idsucursal, codigo_idcodigo, cantidad) (SELECT s0.idsucursal,${response.data.insertId},0 FROM sucursal s0);`,
            (_response)=>{
                if (response.data.warningStatus > 0) {
                    console.log('Duplicate entry ignored, warning issued.');
                    return callback({idcodigo:-1, codigo: '', msg:"DUPLICATED"})
                }
                //console.log(JSON.stringify(response.data))
                return callback({idcodigo:response.data.insertId, codigo: codigo, msg:"Stock added...."})
            }
        )
    })

}

module.exports = {agregarStock}