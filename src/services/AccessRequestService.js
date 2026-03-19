const sucursalDB = require("../database/Sucursal");
const requestDB = require("../database/AccessRequest")
const userDB = require("../database/Usuario")

const validate_request = ({token, phone_number, id_sucursal, id_usuario}, callback) => {
    
    //find branch 
    sucursalDB.obtener_detalle_sucursal(
        {
            idsucursal:id_sucursal
        },
        sucursal_data=>{
            if(!sucursal_data || sucursal_data?.length<1)
            {
                return callback?.({error:"sucursal not found"});
            }

            if(sucursal_data[0].telefono != phone_number)
            {
                return callback?.({error:"invalid phone number"});
            }

            //get pending access request 
            requestDB.get_pending_request(token,(request_data)=>{
                if(!request_data || request_data?.length<1)
                {
                    return callback?.({error:"Not pending request found."});
                }

                //request found
                requestDB.set_request_as_accepted({token},(response3)=>{
                    callback({ok:1});
                })
                

            })

        }
    )

}

const check_request_status = ({qr_data}, callback) => {
    const token = (qr_data.split("_"))[2];
    requestDB.get_request_status({token}, (response) => {
        if(!response || response?.length<1)
        {
            return callback({error:"request not found"});
        }

        if(response[0].status=='pending'){
            return callback({status:"pending"});
        }

        //success, update user token with a new one and send it back to client
        const newUserToken = "thenewtokengoeshere...";

        userDB.setToken2({token: newUserToken, id_usuario:response[0].id_usuario}, reponse3=>{
            return callback({token: newUserToken})
        })

    })
}

const generate_new_request = ({id_sucursal, id_usuario}, callback) => {
    const token = "1234";
    requestDB.add_new_request({id_sucursal, id_usuario, token}, (response)=>{
        return callback({
            qr_data: `${id_sucursal}_${id_usuario}_${token}`
        })
    })
}

module.exports = {validate_request, generate_new_request, check_request_status}