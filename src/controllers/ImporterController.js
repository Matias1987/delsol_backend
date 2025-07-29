const service = require("../services/ImporterService")

const procesar_data = (req, res) => {
    console.log("CONTROLLER")
    const {body} = req;
    console.log(JSON.stringify(body))
    service.procesar_data(body,(response)=>{
        res.status(201).send({status:'OK', data:response})
    })
}

module.exports = {procesar_data}