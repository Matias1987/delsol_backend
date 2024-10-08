const subgrupoService = require("../services/SubGrupoService")

const obtener_subgrupos_grupo = (req, res)=>{
  const {params:{idsubfamilia}} = req;
  subgrupoService.obtener_subgrupos_grupo(idsubfamilia,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const obtenerSubgrupos = (req, res) => {
  const {params:{idsubgrupo, idgrupo, idsubfamilia, idfamilia}} = req;

  let _idg = -1
  let _idsubfamilia= -1
  let _idfamilia=-1
  let _idsubgrupo=-1

  if(typeof idgrupo !== 'undefined')
  {
    if(idgrupo!=null)
    {
      _idg=idgrupo
    }
  }
  if(typeof idsubfamilia !== 'undefined')
  {
    if(idsubfamilia!=null)
    {
      _idsubfamilia=idsubfamilia
    }
  }
  if(typeof idfamilia !== 'undefined')
  {
    if(idfamilia!=null)
    {
      _idfamilia=idfamilia
    }
  }
  if(typeof idsubgrupo !== 'undefined')
  {
    if(idsubgrupo!=null)
    {
      _idsubgrupo=idsubgrupo
    }
  }
  
  subgrupoService.obtenerSubgrupos(_idg,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  },_idsubfamilia,_idfamilia, _idsubgrupo)
}

const obtenerSubgrupo = (req, res) => {


}

const obtener_subgrupos_bygrupo_opt = (req,res)=>{
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {params: {grupoId}} = req;

  subgrupoService.obtener_subgrupos_bygrupo_opt(grupoId,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })

}

const agregarSubgrupo = (req, res) => {
//FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {body} = req;
  const nuevo_subgrupo = {
    'nombre_corto' : body.nombre_corto,
    'nombre_largo' : body.nombre_largo,
    'grupo_idgrupo' : body.grupo_idgrupo,
    'multiplicador': body.multiplicador,
    'precio_defecto': body.precio_defecto,
    'control_stock': body.control_stock,
  }

  subgrupoService.agregarSubgrupo(nuevo_subgrupo,(id)=>{
    if(id<0){
      res.status(201).send({status:'ERROR', data:"El subgrupo ya existe"});
    }
    else{
      res.status(201).send({status:'OK', data:id});
    }
  })
}

const modificar_multiplicador = (req, res) => {
  
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {body} = req;
  console.log("modificar mult. CONTROLLER")
  console.log(JSON.stringify(body))

  subgrupoService.modificar_multiplicador(body.categoria, body.id, body.value, body.incrementar, (data)=>{
    res.status(201).send({status:'OK', data:data});
  })


}

const obtener_detalle_subgrupo = (req, res) => {
  const {params:{subgrupoId}} = req;
  subgrupoService.obtener_detalle_subgrupo(subgrupoId,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
} 

const editarSubgrupo = (req, res) => {
  const {body} = req
  subgrupoService.editarSubgrupo(body,(resp)=>{
    res.status(201).send({status:'OK', data:resp});
  })
}


const modificar_precios_defecto = (req, res) => {
  const {body} = req

  subgrupoService.modificar_precios_defecto(body,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const obtener_descripcion_cat_subgrupo = (req,res) => {
  const {params:{subgrupoId}} = req;
  subgrupoService.obtener_descripcion_cat_subgrupo(subgrupoId,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const mover = (req, res) => {
  const {body} = req
  subgrupoService.mover(body,(resp)=>{
    res.status(201).send({status:'OK', data:resp});
  })
}



module.exports = {
  mover,
  obtenerSubgrupos,
  obtenerSubgrupo,
  agregarSubgrupo,
  editarSubgrupo,
  obtener_subgrupos_bygrupo_opt,
  modificar_multiplicador,
  obtener_detalle_subgrupo,
  modificar_precios_defecto,
  obtener_descripcion_cat_subgrupo,
  obtener_subgrupos_grupo,
  };