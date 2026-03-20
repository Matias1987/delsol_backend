const sucursalDB = require("../database/Sucursal");
const requestDB = require("../database/AccessRequest")
const userDB = require("../database/Usuario");
const { response } = require("express");
const { getSubstring } = require("../lib/helpers");
const ELENGTH = 6;
function formatString(a, l) {
  // Remove leading and trailing whitespace
  let trimmed = a.toString().trim();

  // Pad with zeros if shorter
  let padded = trimmed.length < l ? trimmed.padStart(l, '0') : trimmed;

  // Trim down if longer
  return padded.length > l ? padded.slice(0, l) : padded;
}

const get_qr_code = (id_usuario, id_sucursal, ip) => formatString(id_sucursal, ELENGTH) + formatString(id_usuario, ELENGTH) + ip; 

const get_values = (qr_code) =>{
    //example 000000000006000000000010::1
    console.log("--------------")
    console.log(btoa(qr_code));
    console.log(qr_code);
    const id_sucursal = getSubstring(qr_code,0,ELENGTH);
    const id_usuario = getSubstring(qr_code,ELENGTH,ELENGTH);
    const ip = getSubstring(qr_code, ELENGTH*2, qr_code.length - ELENGTH*2);

    const resp = {id_sucursal: parseInt(id_sucursal), id_usuario: parseInt(id_usuario), ip};
    
    console.log("Recovered data:" + JSON.stringify(resp));

    return resp;

}

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

const check_request_status = ({id_sucursal, id_usuario, ip}, callback) => {
    const test = get_qr_code(id_usuario, id_sucursal, ip); 
    console.log(test)

    get_values(test);
   // const ucode = atob(qr_data);
   // const token = (ucode.split("_"))[2];
    console.log(`Checking status for: ` + JSON.stringify({id_sucursal, id_usuario, ip}));

    requestDB.get_request_by_unique_key({id_sucursal,id_usuario,ip}, (response) => {
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

const generate_new_request = ({id_sucursal, id_usuario, ip}, callback) => {
    
    const token = "1234";
    //does request already exists? 
    requestDB.get_request_by_unique_key({id_sucursal,id_usuario,ip}, (response0)=>{
        if(response0 && response0?.length>0){//request already exists...
            console.log(`The request from: id_sucursal:${id_sucursal} , id_usuario:${id_usuario}, ip:${ip} already exists.`)
            if(response0[0].status=='pending')
            {
                console.log("The request exists and is pending...")
                return callback({
                    qr_data: btoa(`${get_qr_code(id_usuario, id_sucursal, ip)}`)
                    })
            }
            console.log("The request exists and is approved...");
            return callback({exists:1, status:"OK", token:response0[0].token })
        }
        else{
            requestDB.add_new_request({id_sucursal, id_usuario, ip, token}, (response)=>{
                return callback({
                    qr_data: btoa(`${get_qr_code(id_usuario, id_sucursal, ip)}`)
                })
            })
        }
    })
    
}

module.exports = {validate_request, generate_new_request, check_request_status}