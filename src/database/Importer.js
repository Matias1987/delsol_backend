const mysql_connection = require("../lib/mysql_connection");

const doQuery = ( query, callback) => {
    console.log("=======================================================")
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect();
    connection.query(query,(err,response)=>{
        console.log(JSON.stringify(response));
        callback(err, response);
    });
    connection.end();
}

const crear_familia = (parts, callback) =>{
 const query = `insert into familia (nombre_corto, nombre_largo) values ('${parts[0]}','${parts[0]}');`;
 doQuery(query,(err,response)=>{
    callback(err,+response.insertId);
 })
}

const crear_subfamilia = (id_familia, parts, callback) =>{
 const query = `insert into subfamilia (nombre_corto, nombre_largo, familia_idfamilia) values ('${parts[1]}','${parts[1]}', ${id_familia});`;
 doQuery(query,(err,response)=>{
    callback(err,+response.insertId);
 })
}

const crear_grupo = (id_subfamilia, parts, callback) =>{
 const query = `insert into grupo (nombre_corto, nombre_largo, subfamilia_idsubfamilia) values ('${parts[2]}','${parts[2]}', ${id_subfamilia});`;
 doQuery(query,(err,response)=>{
    callback(err,+response.insertId);
 })
}

const crear_subgrupo = (id_grupo, parts, callback) =>{
     const query = `insert into subgrupo (nombre_corto, nombre_largo, grupo_idgrupo) values ('${parts[3]}','${parts[3]}', ${id_grupo});`;
     doQuery(query,(err,response)=>{
        callback(err,+response.insertId);
     })
}

const crear_codigo = (cod_data, callback) =>{
    const query = ``;
    doQuery(query,(err,response)=>{
        callback(err,+response.insertId)
    })
}

const get_field = (field, result, err) => {
    
    console.log(JSON.stringify(result))
    if(err) {return -1;}
    if((result||[]).length>0){
        return result[0][field]
    }
    else{
        return -1;
    }
}

const get_familia_id = (parts, callback) => {
    const query = `select f.idfamilia from familia f where f.nombre_corto = '${parts[0]}';`
    doQuery(query,(err,response)=>{
        callback(get_field('idfamilia',response, err));
    })
}

const get_subfamilia_id = (parts, callback) =>{
    const nombre_corto_familia = parts[0];
    const nombre_corto_subfamilia = parts[1];
    const query = `select sf.idsubfamlia from familia f, subfamilia sf where sf.familia_idfamilia = f.idfamilia and 
    f.nombre_corto = '${nombre_corto_familia}' and sf.nombre_corto = '${nombre_corto_subfamilia}'`;
    doQuery(query,(err,response)=>{
        callback(get_field('idsubfamilia',response, err));
    })
}

const get_grupo_id = (parts, callback) =>{
    const nombre_corto_familia = parts[0];
    const nombre_corto_subfamilia = parts[1];
    const nombre_corto_grupo = parts[2];

    const query = `
    select g.idgrupo 
    from grupo g, subfamilia sf, familia f 
    where
    g.subfamilia_idsubfamilia = sf.idsubfamilia and 
    sf.familia_idfamilia = f.idfamilia and 
    f.nombre_corto = '${nombre_corto_familia}' and 
    sf.nombre_corto = '${nombre_corto_subfamilia}' and 
    g.nombre_corto = '${nombre_corto_grupo}';
    `
    doQuery(query,(err,response)=>{
        callback(get_field('idgrupo',response, err));
    })

}

const get_subgrupo_id = (parts, callback) => {
    const nombre_corto_familia = parts[0];
    const nombre_corto_subfamilia = parts[1];
    const nombre_corto_grupo = parts[2];
    const nombre_corto_subgrupo = parts[3];

    const query = `
    select sg.idsubgrupo from
    subgrupo sg, grupo g, subfamilia sf, familia f where
    sg.grupo_idgrupo = g.idgrupo and
    g.subfamilia_idsubfamilia = sf.idsubfamilia and
    sf.familia_idfamilia = f.idfamilia and 
    f.nombre_corto = '${nombre_corto_familia}' and 
    sf.nombre_corto ='${nombre_corto_subfamilia}' and 
    g.nombre_corto = '${nombre_corto_grupo}' and 
    sg.nombre_corto = '${nombre_corto_subgrupo}'
    `;

    doQuery(query,(err,response)=>{
        callback(get_field('idsubgrupo',response, err));
    })
}

//const data = `ARMAZONES,RECETA,SOL,CADES,CAD01,CA0001C1`;

//const parts = data.split(',');

const process = (parts, lvl, idparent, atFinish) =>{
    console.log(`procesando: ${JSON.stringify(parts, lvl, idparent)} ` )
    switch (lvl) {
        case 0://familia
            //exists?
            get_familia_id(parts,(id_familia)=>{
                if(id_familia<0)
                {
                    console.log("Familia not found")
                    //doesnt exists..
                    crear_familia(parts,(err, id_familia)=>{
                        console.log("CREATED idfamilia: " + id_familia)
                        process(parts,1,id_familia)
                    })
                }
                else{
                    console.log("idfamilia: " + id_familia)
                    process(parts,1,id_familia)
                }
            })
            break;
        case 1://subfamilia
            get_subfamilia_id(parts,(id_subfamilia)=>{
                if(id_subfamilia<0)
                {
                    crear_subfamilia(idparent, parts,(err, id_subfamilia)=>{
                        process(parts,2,id_subfamilia)
                    })
                }
                else{
                    process(parts,2,id_subfamilia)
                }
            })
            
            break;
        case 2://grupo
            get_grupo_id(parts,(id_grupo)=>{
                if(id_grupo<0){
                    crear_grupo(idparent,parts,(err, id_grupo)=>{
                        process(parts,3,id_grupo)
                    })
                }
                else{
                    process(parts,3,id_grupo)
                }
            })
            break;
        case 3:
            get_subgrupo_id(parts, (id_subgrupo)=>{
                if(id_subgrupo<0){
                    crear_subgrupo(idparent,parts,(err, id_subgrupo)=>{
                        atFinish(id_subgrupo)
                    })
                }
                else{
                    atFinish(id_subgrupo)
                }
            })
            break;
     
    
        default:
            break;
    }
}


const importar = (data, callback) =>{
    console.log(`trying to import this data: ${data.data}`)
    const _data = data.data.split(',');
    process(_data,0,-1,(idsubgrupo)=>{
        callback(idsubgrupo)
    })
}

module.exports = {importar} 