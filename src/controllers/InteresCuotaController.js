const ICService =  require("../services/InteresCuotaService")

const obtenerInteresCuotas = (req,res) => {
    
    ICService.obtenerInteresCuotas((rows)=>{
        res.status(201).send({status:'OK', data:rows});
    })

}

const modifInteresCuota = (req, res) => 
{

}

module.exports = {obtenerInteresCuotas,modifInteresCuota}