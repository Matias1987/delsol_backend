const codigoService = require("../services/CodigoService")

const obtenerCodigo = (req,res) => {
   //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   const {body} = req;
  
  codigoService.obtenerCodigo(body.codigo,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const obtenerCodigoPorId = (req, res) => {
 
  const {params:{codigoId}} = req;
  codigoService.obtenerCodigoPorID(codigoId,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })

}

const search_codigos = (req,res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {params:{search_param}} = req;

  codigoService.search_codigos(search_param,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const obtenerCodigos = (req, res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  codigoService.obtenerCodigos((rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}

const agregarCodigo = (req, res) => {
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  const {body} = req;
  const nuevo_codigo = {
    'codigo': body.codigo,
    'descripcion': body.descripcion,
    'subgrupo_idsubgrupo': body.subgrupo_idsubgrupo,
    'modo_precio': (typeof body.modo_precio=='undefined' ? 0 : body.modo_precio),
    'precio': (typeof body.precio=='undefined' ? 0 : body.precio),
    'genero': (typeof body.genero === 'undefined' ? '' : body.genero ),
    'edad': (typeof body.edad === 'undefined' ? '' : body.edad ), 
    'costo': (typeof body.costo === 'undefined' ? 0 : body.costo),
    'esf': typeof body.esf === 'undefined' ? 0 : body.esf,
    'cil': typeof body.cil === 'undefined' ? 0 : body.cil,
    'ad': typeof body.ad === 'undefined' ? 0 : body.ad,
  }
  codigoService.agregarCodigo(nuevo_codigo,
    (id)=>{
      if(id<0){
        res.status(201).send({status:'ERROR', data:-1})
      }
      else{
        res.status(201).send({status:'OK', data:id})
      }
      
    })
}

const editarCodigo = (req, res) => {}

const obtener_codigos_bysubgrupo_opt = (req,res) =>{
  //FROM https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const {params:{subgrupoId}} = req;

  codigoService.obtener_codigos_bysubgrupo_opt(subgrupoId,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })

}

const obtener_codigos_categoria = (req,res)=>{
  const {params:{idfamilia,idsubfamilia,idgrupo,idsubgrupo,modo_precio}} = req;
  codigoService.obtener_codigos_categoria(
    {
      idfamilia:idfamilia,
      idsubfamilia:idsubfamilia,
      idgrupo:idgrupo,
      idsubgrupo:idsubgrupo,
      modo_precio:modo_precio
    }
    ,(rows)=>{
    res.status(201).send({status:'OK', data:rows});
  })
}


module.exports = {
    obtenerCodigoPorId,
    obtenerCodigos,
    obtenerCodigo,
    agregarCodigo,
    editarCodigo,
    obtener_codigos_bysubgrupo_opt,
    search_codigos,
    obtener_codigos_categoria,
  };