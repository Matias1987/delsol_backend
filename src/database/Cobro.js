const mysql_connection = require("../lib/mysql_connection");
const cobro_queries = require("./queries/cobroQueries");

const agregar_venta_mp_ctacte = (data,callback) =>
{
     const __query_venta_mp = `INSERT INTO venta_has_modo_pago 
        (
            venta_idventa, 
            modo_pago, 
            banco_idbanco, 
            mutual_idmutual,
            monto, 
            monto_int, 
            cant_cuotas, 
            monto_cuota
            ) VALUES (
                ${data.idventa},
                '${'ctacte'}',
                ${null},
                ${null},
                ${data.mp.ctacte_monto},
                ${parseFloat(data.mp.ctacte_cuotas) * parseFloat(data.mp.ctacte_monto_cuotas)}, 
                ${data.mp.ctacte_cuotas},
                ${data.mp.ctacte_monto_cuotas})` ;
    
    //console.log(`QUERY: ${__query_venta_mp}`)

    const connection = mysql_connection.getConnection();
    connection.connect()

    if(typeof data.removeMPRows !== 'undefined'){
        if(+data.removeMPRows == 1){
            console.log("ELIMINAR MODO DE PAGOS")
            connection.query(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.venta_idventa=${data.idventa};`)
        }
    }

    if(typeof data.removeCtaCteRow !== 'undefined'){
        if(+data.removeCtaCteRow == 1){
            console.log("ELIMINAR MODO DE PAGOS MP")
            connection.query(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.modo_pago = 'ctacte' and vhmp.venta_idventa=${data.idventa};`)
        }
    }
    console.log("CREAR MODO DE PAGOS")
    connection.query(__query_venta_mp,(err,resp)=>{
        callback(0);
    })
    //UPDATE VENTA DESCUENTO Y SALDO

    connection.query(`UPDATE venta  v SET v.descuento=${data.descuento}, debe=v.subtotal-${data.descuento},  monto_total=v.subtotal-${data.descuento}  WHERE v.idventa=${data.idventa};`)

    connection.end()


    
}

const agregar_cobro  = (data,callback) => {

    /*
    params:
        tipo: cuota, adelanto
        si cuota: idcliente (id venta is null or undefined --todo?)
        si adelanto: idventa

        @removeMPRows: if defined, the 'modo de pago' rows are deleted
        @removeCtaCteRow: if defined, only the 'ctacte' type of 'modo de pago' are removed.

    */

    /**
     * En el caso del ingreso, los modo de pago de la venta deben 
     * eliminarse y luego volver a crearse. ToDo
     * 
     * <!>Es posible que el modo de pago sea solo cta cte, en ese caso no deberia crearse un registro de cobro 
     * y solamente deberia crearse un registro de modo de pago...
     */

    /*console.log(JSON.stringify(data))
    console.log("########")
    console.log(
        JSON.stringify({
            monto_ctacte: data.mp.ctacte_monto,
            monto_cuotas: data.mp.ctacte_monto_cuotas,
            cant_cuotas: data.mp.ctacte_cuotas,
        })
    )*/
    //for later use
    const add = (arr,val,idx) => parseFloat(val.monto) == 0 ? arr : [...arr,val]
    
    const get_mp_obj = vars => ({
        monto: vars.monto,
        tipo: vars.tipo,
        tarjeta: typeof vars.tarjeta === 'undefined' ? null : vars.tarjeta,
        fkmutual: typeof vars.fkmutual === 'undefined' ? null : vars.fkmutual,
        fkbanco: typeof vars.fkbanco === 'undefined' ? null : vars.fkbanco,
        cant_cuotas: typeof vars.cant_cuotas === 'undefined' ? 0 : vars.cant_cuotas,
        monto_cuota: typeof vars.monto_cuota === 'undefined' ? 0 : vars.monto_cuota,

    })

    /* solo si es modo de pago cta cte */

    if(data.monto == data.mp.ctacte_monto && data.mp.ctacte_monto>0){
        /**
         * en este caso, insertar venta modo de pago y retornar -1 al cliente
         * 
         */

        agregar_venta_mp_ctacte(data,callback)

        return;//nothing else to do
    }
 
    const __query = `insert into cobro (            
        caja_idcaja,
        usuario_idusuario,
        cliente_idcliente,
        venta_idventa,
        monto,
        tipo,
        sucursal_idsucursal,
        fecha
        ) values (
        ${data.caja_idcaja}, 
        ${data.usuario_idusuario}, 
        ${typeof data.idcliente === 'undefined' ? 'null' : data.idcliente}, 
        ${typeof data.idventa === 'undefined' ? 'null' : data.idventa}, 
        ${data.monto - data.mp.ctacte_monto /* subtract ctacte monto */}, 
        '${data.tipo}',
        ${data.sucursal_idsucursal},
        date('${data.fecha}')
        )`;

    //console.log(__query)

    const connection = mysql_connection.getConnection();
    connection.connect();

    /* REMOVE OLD MP ROWS! (ONLY IF NECESSARY) */
    if(typeof data.removeMPRows !== 'undefined'){
            if(+data.removeMPRows == 1){
                connection.query(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.venta_idventa=${data.idventa};`)
            }
        }
        
    if(typeof data.removeCtaCteRow !== 'undefined'){
        if(+data.removeCtaCteRow == 1){
            connection.query(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.modo_pago = 'ctacte' and vhmp.venta_idventa=${data.idventa};`)
        }
    }

    connection.query(
        __query,
        (err,results)=>{
            //console.log(results)
        const idcobro = results.insertId
        //PAGO GUARDADO, PREPARAR MODOS DE PAGOS Y VENTA MODO PAGO
       console.log("Payment saved with id: " + idcobro);

        var _mp = []
        
        _mp = add(
            _mp,
            get_mp_obj({
                monto: data.mp.efectivo_monto, 
                tipo: 'efectivo'
            }),
            "efectivo_monto")

        _mp = add(
            _mp,
            get_mp_obj({
                monto: data.mp.tarjeta_monto,
                tipo: 'tarjeta',
                tarjeta: data.mp.tarjeta_tarjeta,
            }),
            "tarjeta_monto")
        _mp = add(
            _mp,
            get_mp_obj({
                monto:data.mp.ctacte_monto,
                tipo: 'ctacte',
                cant_cuotas: data.mp.ctacte_cuotas,
                monto_cuota: data.mp.ctacte_monto_cuotas,
            }),
            "ctacte_monto")
        _mp = add(
            _mp,
            get_mp_obj({
                monto:data.mp.mutual_monto,
                tipo: 'mutual',
                fkmutual: null
            }),
            "mutual_monto"
            )
        _mp = add(
            _mp,
            get_mp_obj({
                monto: data.mp.cheque_monto,
                tipo: 'cheque',
                fkbanco: null
            }),
            "cheque_monto")
        
        _mp = add(
            _mp,
            get_mp_obj({
                monto: data.mp.mercadopago_monto,
                tipo: 'mercadopago',
            }),
            "mercadopago_monto")

            //console.log("ALL MP:  "  + JSON.stringify(_mp))

        var _cobro_mp_item = ``
        var _venta_mp_item = ``
        var total = 0;
        _mp.forEach((mp)=>{

            _cobro_mp_item +=  (_cobro_mp_item.length>0 ? ',': '') +
            `(${idcobro},
            '${mp.tipo}',
            ${mp.fkbanco},
            ${mp.fkmutual},
            '${mp.monto}',
            '${mp.cant_cuotas}',
            '${mp.monto_cuota}', 
            '${parseFloat(mp.cant_cuotas) * parseFloat(mp.monto_cuota)}')`
            
            if(mp.tipo!='ctacte')
            {
                //console.log(`monto to add: ${mp.monto}`)
                total+=parseFloat(mp.monto);
            }

        })

        if(typeof data.idventa !== 'undefined'){
            _mp.forEach((mp)=>{
                _venta_mp_item +=  (_venta_mp_item.length>0 ? ',': '') +`
                (
                    ${data.idventa},
                    '${mp.tipo}',
                    ${mp.fkbanco},
                    ${mp.fkmutual},
                    ${mp.monto},
                    ${parseFloat(mp.cant_cuotas) * parseFloat(mp.monto_cuota)}, 
                    ${mp.cant_cuotas},
                    ${mp.monto_cuota})
                `;

            })
        }
        //FIN DE PREPARACION...
        var __query = `INSERT INTO cobro_has_modo_pago 
        (
            cobro_idcobro,
            modo_pago, 
            banco_idbanco, 
            mutual_idmutual, 
            monto, 
            cant_cuotas, 
            monto_cuota, 
            total_int
        ) VALUES ` + _cobro_mp_item;

        const __query_venta_mp = `INSERT INTO venta_has_modo_pago 
        (
            venta_idventa, 
            modo_pago, 
            banco_idbanco, 
            mutual_idmutual,
            monto, 
            monto_int, 
            cant_cuotas, 
            monto_cuota
            ) VALUES ` + _venta_mp_item;


        //console.log(__query)

        connection.query(__query,(err,_results)=>{
            
            if(typeof data.idventa !== 'undefined'){
                //hope this works!!
                connection.query(__query_venta_mp,(err,___results)=>{})
    
                //console.log(`UPDATE venta  v SET v.descuento=${data.descuento}, v.haber=v.haber + ${total}, v.saldo = v.saldo - ${total} WHERE v.idventa=${data.idventa};`)
                //UPDATE DEBE AND HABER FIELDS IN VENTA
                connection.query(`UPDATE venta  v SET v.descuento=${data.descuento}, v.debe=v.subtotal-${data.descuento},  v.monto_total=v.subtotal-${data.descuento},  v.haber=v.haber + ${total}, v.saldo = v.saldo - ${total} WHERE v.idventa=${data.idventa};`)
            }

            callback(idcobro);
            connection.end();  
        })
        //SAVE VENTA MP!, THESE HAVE BEEN DELETED BEFORE... (ONLY IN INGRESO)
        

                  
        }
    );
    
}

const lista_cobros = (data, callback) => {
    const _idcliente = typeof data.idcliente === 'undefined' ? '' : data.idcliente
    const _idventa = typeof data.idventa === 'undefined' ? '' : data.idventa
    const _idsucursal = typeof data.idsucursal === 'undefined' ? '' : data.idsucursal
    const _idcobro = typeof data.idcobro === 'undefined' ? '' : data.idcobro
    const _fecha = typeof data.fecha === 'undefined' ? '' : data.fecha
    const _anulado = typeof data.anulado === 'undefined'? '' : data.anulado

    const connection = mysql_connection.getConnection();
    connection.connect();
    const _q = `SELECT 
    c.* , 
    date_format(c.fecha,'%d-%m-%Y') as 'fecha_formated',
    cl.dni AS 'cliente_dni',  
    CONCAT(cl.apellido,', ', cl.nombre) AS 'cliente_nombre',
    s.nombre as sucursal 
    FROM cobro c, cliente cl , sucursal s
    WHERE 
    c.sucursal_idsucursal = s.idsucursal and 
    c.cliente_idcliente = cl.idcliente and
    (case when '' <> '${_idsucursal}' then c.sucursal_idsucursal = '${_idsucursal}' else true end) and 
    (case when '' <> '${_idcliente}' then '${_idcliente}' = c.cliente_idcliente ELSE TRUE end) and 
    (case when '' <> '${_idventa}' then '${_idventa}' = c.venta_idventa ELSE TRUE end) and 
    (case when '' <> '${_idcobro}' then '${_idcobro}' = c.idcobro ELSE TRUE end) and
    (case when '' <> '${_anulado}' then '${_anulado}' = c.anulado else true end)  and 
    (case when '' <> '${_fecha}' then date('${_fecha=='' ? `1970-01-01` : _fecha}') = date(c.fecha) ELSE TRUE end) 
    order by c.idcobro desc
    limit 500;`
    //console.log(_q)
    connection.query(
        _q,
        (err,results)=>{
            callback(results);
        }
    );
    connection.end();
}
/*
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
}*/

const detalle_cobro = (idcobro, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    //console.log(cobro_queries.queryDetalleCobro(idcobro))
    connection.query(
        cobro_queries.queryDetalleCobro(idcobro),(err,results)=>{
            return callback(results);
        }
    );
    connection.end();
}

const lista_mp_cobro = (idcobro, callback) => {
    const query = `SELECT cmp.* FROM cobro_has_modo_pago cmp WHERE cmp.cobro_idcobro=${idcobro};`
    const connection = mysql_connection.getConnection();
    connection.connect();
    //console.log(query)
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end();

}


const anular_cobro = (data, callback) => {
    const query = `update cobro c set c.anulado = 1 where c.idcobro = ${data.idcobro}`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}


module.exports = {
    agregar_cobro,
    lista_cobros,
    detalle_cobro,
    lista_mp_cobro,
    anular_cobro,
}