const mysql_connection = require("../lib/mysql_connection");
const cobro_queries = require("./queries/cobroQueries");

const agregar_cobro  = (data,callback) => {

    /*
        tipo: cuota, adelanto
        si cuota: idcliente (id venta is null or undefined --todo?)
        si adelanto: idventa
    */

    const add = (arr,val,idx) => (arr||0) == 0 ? arr : {...arr,[idx]: val}
    const get_obj = vars => ({
        monto: vars.monto,
        tipo: vars.tipo,
        tarjeta: typeof vars.tarjeta === 'undefined' ? null : vars.tarjeta,
        fkmutual: typeof vars.fkmutual === 'undefined' ? null : vars.fkmutual,
        fkbanco: typeof vars.fkbanco === 'undefined' ? null : vars.fkbanco,
        cant_cuotas: typeof vars.cant_cuotas === 'undefined' ? 0 : vars.cant_cuotas,
        monto_cuota: typeof vars.monto_cuota === 'undefined' ? 0 : vars.monto_cuota,

    })

    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        cobro_queries.queryAgregarCobro(),
        [[
            data.caja_idcaja,
            data.usuario_idusuario,
            typeof data.cliente_idcliente === 'undefined' ? null : data.cliente_idcliente,
            typeof data.venta_idventa === 'undefined' ? null : data.venta_idventa,
            data.monto,
            data.tipo
        ]],
        (err,results)=>{
        const idcobro = results.insertId
            /*
                modo de pago structure:
                    efectivo_monto: 0,
                    tarjeta_monto: 0,
                    tarjeta_tarjeta: 0,
                    ctacte_monto: 0,
                    ctacte_cuotas: 0,
                    ctacte_monto_cuotas: 0,
                    cheque_monto: 0,
                    mutual_monto: 0,
                    mutual_mutual: 0,
                    total: 0,
            */
            
            var _mp = []
            
            _mp = add(
                _mp,
                get_obj({
                    monto: data.mp.efectivo_monto, 
                    tipo: 'efectivo'
                }),
                "efectivo_monto")

            _mp = add(
                _mp,
                get_obj({
                    monto: data.mp.tarjeta_monto,
                    tipo: 'tarjeta',
                    tarjeta: data.mp.tarjeta_tarjeta,
                }),
                "tarjeta_monto")
            _mp = add(
                _mp,
                get_obj({
                    monto:data.mp.efectivo_monto,
                    tipo: 'ctacte',
                    cant_cuotas: data.mp.cant_cuotas,
                    monto_cuota: data.mp.monto_cuota,
                }),
                "ctacte_monto")
            _mp = add(
                _mp,
                get_obj({
                    monto:data.mp.mutual_monto,
                    tipo: 'mutual',
                    fkmutual: null
                }),
                "mutual_monto"
                )
            _mp = add(
                _mp,
                get_obj({
                    monto: data.mp.cheque_monto,
                    tipo: 'cheque',
                    fkbanco: null
                }),
                "cheque_monto")

            var _q = ``
            _mp.forEach((mp)=>{
                _q +=  (_q.length>0 ? ',': '') +
                `(${idcobro},
                  ${1},
                  ${mp.fkbanco},
                  ${mp.fkmutual},
                  '${mp.monto}',
                 '${mp.cant_cuotas}',
                 '${mp.monto_cuota}', 
                '${parseFloat(mp.cant_cuotas) * parseFloat(mp.monto_cuota)}')`
            })

            var __query = `INSERT INTO cobro_has_modo_pago 
            (
                cobro_idcobro,
                modo_pago_idmodo_pago, 
                banco_idbanco, 
                mutual_idmutual, 
                monto, 
                cant_cuotas, 
                monto_cuota, 
                total_int
            ) VALUES ` + _q;


            console.log(__query)

            connection.query(__query,(err,_results)=>{
                return callback(idcobro);
            })
            connection.end();            
        }
    );
    
}

const lista_cobros = (callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        cobro_queries.queryListaCobros(),
        (err,results)=>{
            return callback(results);
        }
    );
    connection.end();
}

const lista_cobros_sucursal = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        cobro_queries.queryListaCobrosSucursal(data.id),
        (err,results)=>{
            return callback(results);
        }
    );
    connection.end();
}

const detalle_cobro = (data, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        cobro_queries.queryDetalleCobro(data.id),(err,results)=>{
            return callback(results);
        }
    );
    connection.end();
}

module.exports = {
    agregar_cobro,
    lista_cobros,
    lista_cobros_sucursal,
    detalle_cobro
}