const { doQuery, escapeHelper } = require("./helpers/queriesHelper");
const UsuarioDB = require("./Usuario");

const obtenerCargaManual = (idcargamanual,callback) => {
    const query =  `select * from carga_manual cm where cm.idcarga_manual = ${idcargamanual}`
    doQuery(query,(resp)=>{
        callback(resp.data);
    })
}

const modificar_carga_manual = (data,callback)=> 
{
    const query = `update carga_manual cm set cm.monto = ${data.monto} where cm.idcarga_manual= ${data.id}`

    doQuery(query,(resp)=>{
        callback(resp.data);
    });
}

const do_agregarCargaManual = (data, callback) => {
    const sql = `insert into carga_manual (
        caja_idcaja,
        usuario_idusuario,
        cliente_idcliente,
        sucursal_idsucursal,
        monto,
        concepto) 
    values (
    ${escapeHelper(data.caja_idcaja)},
    ${escapeHelper(data.usuario_idusuario)},
    ${escapeHelper(data.cliente_idcliente)},
    ${escapeHelper(data.sucursal_idsucursal)},
    ${escapeHelper(data.monto)},
    ${escapeHelper(data.concepto)})`;

    doQuery(sql,(resp)=>{
        const result = resp.data;
        return callback(result.insertId);
    });
}

const agregarCargaManual= (data,callback) =>
{
    UsuarioDB.validar_usuario_be({tk:data.tk},()=>{do_agregarCargaManual(data,callback)},()=>{})
}

const anularCargaManual = (data,callback)=>{
    const query = `update carga_manual cm set cm.anulado = 1 where cm.idcarga_manual=${escapeHelper(data.id)}`
    doQuery(query,(resp)=>{
        callback(resp.data);
    });
}

module.exports = {agregarCargaManual, anularCargaManual,obtenerCargaManual,modificar_carga_manual,}