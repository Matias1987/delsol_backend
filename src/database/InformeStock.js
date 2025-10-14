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

const totales_venta_codigo_periodo = (data, callback) =>{

	const query = `SELECT c0.codigo, c0.descripcion, qtties.qtty FROM codigo c0,
					(
						SELECT 
						vhs.stock_codigo_idcodigo AS 'idcodigo', 
						SUM(vhs.cantidad) AS 'qtty' 
						FROM 
						venta_has_stock vhs 
						WHERE 
						vhs.stock_codigo_idcodigo IN 
						(
							SELECT c.idcodigo FROM codigo c, subgrupo sg, grupo g, subfamilia sf WHERE
							c.subgrupo_idsubgrupo = sg.idsubgrupo AND sg.grupo_idgrupo = g.idgrupo AND 
							g.subfamilia_idsubfamilia = sf.idsubfamilia AND 
							(case when ''<>'' then sg.idsubgrupo='' ELSE TRUE END) AND 
							(case when ''<>'' then g.idgrupo='' ELSE TRUE END ) AND 
							(case when ''<>'' then sf.idsubfamilia='' ELSE TRUE END ) AND 
							(case when ''<>'' then sf.familia_idfamilia='' ELSE TRUE END)
						) AND 
						vhs.venta_idventa IN 
						(
							SELECT v.idventa FROM venta v WHERE DATE(v.fecha) >= DATE_ADD(DATE(NOW()), INTERVAL -30 DAY) AND v.estado='ENTREGADO'
						)
						GROUP BY vhs.stock_codigo_idcodigo
					) qtties WHERE qtties.idcodigo = c0.idcodigo ORDER BY qtties.qtty desc;`;
	console.log(query);
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
	totales_venta_codigo_periodo,
}