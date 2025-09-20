const { doQuery } = require("./helpers/queriesHelper");


const totales_stock = (data, callback) =>{
	const {
		idfamilia,
		idsubfamilia, 
		idgrupo, 
		idsubgrupo,
		codigo,
		sucursal
	} = data;

	console.log(JSON.stringify(data))

    const query = `
	select * from(
	SELECT  
	c.idcodigo,
	f.nombre_corto AS 'familia',
	sf.nombre_corto AS 'subfamilia', 
	g.nombre_corto AS 'grupo',
	sg.nombre_corto AS 'subgrupo',
	c.codigo AS 'codigo',
	c.descripcion,
	sum(if(ss.codigo_idcodigo IS NULL , 0 , ss.cantidad)) AS 'cantidad'
FROM 
	familia f,
	subfamilia sf, 
	grupo g,
	subgrupo sg,
	codigo c LEFT JOIN 
	( SELECT * from stock s WHERE (case when ${sucursal}<>-1 then s.sucursal_idsucursal=${sucursal} ELSE TRUE END )) ss ON c.idcodigo = ss.codigo_idcodigo
WHERE
	f.idfamilia = sf.familia_idfamilia AND 
	sf.idsubfamilia = g.subfamilia_idsubfamilia AND 
	g.idgrupo = sg.grupo_idgrupo AND 
	sg.idsubgrupo = c.subgrupo_idsubgrupo AND 
	(case when '${idfamilia}'<>'-1' then f.idfamilia='${idfamilia}' ELSE TRUE END ) AND 
	(case when '${idsubfamilia}'<>'-1' then sf.idsubfamilia ='${idsubfamilia}' ELSE TRUE END) AND 
	(case when '${idgrupo}'<>'-1' then g.idgrupo ='${idgrupo}' ELSE TRUE END ) AND 
	(case when '${idsubgrupo}'<>'-1' then sg.idsubgrupo = '${idsubgrupo}' ELSE TRUE END ) AND 
	(case when '${codigo}'<>'' then c.codigo LIKE '%${codigo}%' ELSE TRUE END )
	GROUP BY c.idcodigo) sss order by sss.cantidad desc;`;

	console.log(query)

	doQuery(query,({err,data})=>{
		if(err)
		{
			//error
		}
		callback(data)
	})
}

module.exports = {
	totales_stock,
}