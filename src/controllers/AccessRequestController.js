const service = require("../services/AccessRequestService");


const validate_request = (req,res) => {
    const {body} = req;
    service.validate_request(body,response=>{
        res.send({status:"OK", data: response});
    })
}

const generate_new_request= (req ,res) => {
    //console.log(JSON.stringify(req))
    const {body} = req;
    service.generate_new_request({...body, ip: req.ip}, response=>{
        res.send({status:"OK", data:response});
    })
}

const check_request_status = (req,res) => {
    const {body} = req;
    service.check_request_status({...body, ip: req.ip},(response)=>{
        res.send({status:"OK", data:response});
    })
}

module.exports = {validate_request, generate_new_request, check_request_status}