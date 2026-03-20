const { getFormattedDateLocal } = require("../lib/helpers");
const { doQuery, escapeHelper } = require("./helpers/queriesHelper");

const get_pending_request = (token, callback) => {
  const query = `select * from access_request ar where ar.token = ${escapeHelper(token)} and ar.status='pending'; `;
  doQuery(query, (response) => {
    callback?.(response.data);
  });
};

const get_request_status = ({ token }, callback) => {
  const query = `select ar.status from access_request ar where ar.token = ${escapeHelper(token)}; `;
  //console.log(query);
  doQuery(query, (response) => {
    callback?.(response.data);
  });
};

const add_new_request = ({ id_sucursal, id_usuario, token, ip }, callback) => {
  const today =  getFormattedDateLocal();

  //console.log(JSON.stringify({id_sucursal, id_usuario, ip}))
  const query = `INSERT ignore INTO access_request (id_sucursal, id_usuario, token, ip, date) 
  VALUES (${id_sucursal}, ${id_usuario}, '${token}', ${escapeHelper(ip)}, '${today}');`;
  //console.log(query)
  doQuery(query, (response) => {
    callback?.(response.data);
  });
};

const set_request_as_accepted = ({token}, callback) => {
    const query = `update access_request ar set ar.status='ok' where ar.token=${token} `;

    doQuery(query,(response)=>{
        callback?.(response.data)
    })

}

const get_request_by_unique_key = ({id_sucursal, id_usuario, ip}, callback) => {
  const today =  getFormattedDateLocal();
  const query = `select * from access_request r where 
  r.date='${today}' and
  r.id_sucursal=${escapeHelper(id_sucursal)} and 
  r.id_usuario=${escapeHelper(id_usuario)} and 
  r.ip=${escapeHelper(ip)} `;
  //console.log(query);
  doQuery(query,(response)=>{
    
    callback?.(response.data)
  })
}

module.exports = { 
    get_pending_request, 
    get_request_status, 
    add_new_request,
    set_request_as_accepted,
    get_request_by_unique_key,
};
