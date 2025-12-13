const { doQuery } = require("./helpers/queriesHelper");

const modificar_precios_indv = ({
    idfamilia,
    idsubfamilia, 
    idgrupo,
    idsubgrupo,
    porcentaje,
    monto
}, callback) => {
    const query = `UPDATE codigo c1 SET c.modo_precio = 1 AND c1.precio = (c1.precio * (${porcentaje} / 100)) + c1.precio WHERE c1.idcodigo IN 
            (
                SELECT c.idcodigo FROM codigo c, subgrupo sg, grupo g, subfamilia sf 
                WHERE
                c.subgrupo_idsubgrupo = sg.idsubgrupo AND 
                sg.grupo_idgrupo = g.idgrupo AND 
                g.subfamilia_idsubfamilia = sf.idsubfamilia AND 
                (case when '${idfamilia}'<>'' then sf.familia_idfamilia= ${idfamilia} ELSE TRUE END) AND
                (case when '${idsubfamilia}'<>'' then sf.idsubfamilia= ${idsubfamilia} ELSE TRUE END) AND
                (case when '${idgrupo}'<>'' then g.idgrupo ${idgrupo} ELSE TRUE END) AND
                (case when '${idsubgrupo}'<>'' then sg.idsubgrupo= ${idsubgrupo} ELSE TRUE END)
            );`;


    doQuery(query,(response)=>{
        callback(response)
    })
}

const modificar_cant_critica = ({idcodigo, cantidad}, callback) => {
    const query = `update codigo c set c.stock_critico=${cantidad} where c.idcodigo=${idcodigo}`;
    doQuery(query,(response)=>{
        callback(response.data)
    })
}

module.exports = {modificar_precios_indv, modificar_cant_critica}