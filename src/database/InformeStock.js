const totales_stock = (data, callback) =>{
    const query = `SELECT  
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
	( SELECT * from stock s WHERE (case when -1<>-1 then s.sucursal_idsucursal=0 ELSE TRUE END )) ss ON c.idcodigo = ss.codigo_idcodigo
WHERE
	f.idfamilia = sf.familia_idfamilia AND 
	sf.idsubfamilia = g.subfamilia_idsubfamilia AND 
	g.idgrupo = sg.grupo_idgrupo AND 
	sg.idsubgrupo = c.subgrupo_idsubgrupo AND 
	(case when -1<>-1 then f.idfamilia=0 ELSE TRUE END ) AND 
	(case when -1<>-1 then sf.idsubfamilia =0 ELSE TRUE END) AND 
	(case when -1<>-1 then g.idgrupo =0 ELSE TRUE END ) AND 
	(case when -1<>-1 then sg.idsubgrupo = 0 ELSE TRUE END ) AND 
	(case when ''<>'' then c.codigo LIKE '%%' ELSE TRUE END )
	GROUP BY c.idcodigo`
}