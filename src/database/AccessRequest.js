const { doQuery, escapeHelper } = require("./helpers/queriesHelper");

const get_pending_request = (token, callback) => {
  const query = `select * from access_request ar where ar.token = ${escapeHelper(token)} and ar.status='pending'; `;
  doQuery(query, (response) => {
    callback?.(response.data);
  });
};

const get_request_status = ({ token }, callback) => {
  const query = `select ar.status from access_request ar where ar.token = ${escapeHelper(token)}; `;
  console.log(query);
  doQuery(query, (response) => {
    callback?.(response.data);
  });
};

const add_new_request = ({ id_sucursal, id_usuario, token }, callback) => {
  const query = `INSERT INTO access_request (id_sucursal, id_usuario, token) VALUES (${id_sucursal}, ${id_usuario}, '${token}');`;
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

module.exports = { 
    get_pending_request, 
    get_request_status, 
    add_new_request,
    set_request_as_accepted
};
