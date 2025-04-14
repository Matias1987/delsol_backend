const service = require("../services/ObjetivoSucursalService")

const obtener_objetivo_sucursal = (req, res) =>{
    const {body} = req
    service.obtener_objetivo_sucursal(body,(response=>{
        res.status(201).send({msg:"OK", data:response})
    }))
}
const establecer_objetivo_sucursal = (req, res) =>{
    const {body} = req
    service.establecer_objetivo_sucursal(body,response=>{
        res.status(201).send({msg:"OK", data:response})
    })
}
const obtener_progreso_sucursal_objetivo = (req, res) =>{
    const {body} = req
    service.obtener_progreso_sucursal_objetivo(body,response=>{
        //two rows expected
        console.log(JSON.stringify(response))
        const result = {
            ventas:0,
            objetivo:0,
            progreso:0,
            err: 1
        }

        if(typeof response.err !== 'undefinied')
        {
            if((response||[]).length >1)
            {
                for(let i=0;i<response.length;i++)
                {
                    if('v' == response[i].tipo )
                    {
                        result.ventas = parseFloat(response[i].monto||"0")
                    }
                    else{
                        result.objetivo = parseFloat(response[i].monto||"0")
                    }
                }

                result.progreso = +result.objetivo<1 ? 0 :
                                  +result.objetivo<=result.ventas ? 100 : 
                                  ((+result.ventas)/(+result.objetivo) *100  )
            }
        }

        res.status(201).send({msg:"OK", data:result})
    })
}


module.exports = {
    obtener_objetivo_sucursal,
    obtener_progreso_sucursal_objetivo,
    establecer_objetivo_sucursal,
}