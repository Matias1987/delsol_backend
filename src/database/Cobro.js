const mysql_connection = require("../lib/mysql_connection");
const { obtenerCajaAbierta } = require("./queries/cajaQueries");
const cobro_queries = require("./queries/cobroQueries");
const { insertEvento } = require("./queries/eventoQueries");
const UsuarioDB = require("./Usuario") 

const doQuery = (query, callback=null) => {
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,response)=>{
        if(err)
        {
            console.log("Error " + JSON.stringify(err))
            return callback?.(err,null)
        }
        callback?.(err,response)
    })
    connection.end()
}

const do_agregar_cobro_v2 = (data , callback) => {

    const connection = mysql_connection.getConnection();

    //console.log(JSON.stringify(data))
    //console.log("using new version.....")
    const add = (arr,val,idx) => parseFloat(val.monto) == 0 ? arr : [...arr,val]
    
    const get_mp_obj = vars => ({
        monto: vars.monto,
        tipo: vars.tipo,
        tarjeta: typeof vars.tarjeta === 'undefined' ? null : vars.tarjeta,
        
        fkmutual: typeof vars.fkmutual === 'undefined' ? null : vars.fkmutual,
        fkbanco: typeof vars.fkbanco === 'undefined' ? null : vars.fkbanco,
        cant_cuotas: typeof vars.cant_cuotas === 'undefined' ? 0 : vars.cant_cuotas,
        monto_cuota: typeof vars.monto_cuota === 'undefined' ? 0 : vars.monto_cuota,
        fk_tarjeta: typeof vars.fk_tarjeta === 'undefined' ? null : vars.fk_tarjeta,
    })

    if(data.monto == data.mp.ctacte_monto && data.mp.ctacte_monto>0){
        /*** en este caso, insertar venta modo de pago y retornar -1 al cliente     */
        agregar_venta_mp_ctacte(data,callback)
        return;//nothing else to do
    }

   
    if(typeof data.removeMPRows !== 'undefined'){ /* REMOVE OLD MP ROWS! (ONLY IF NECESSARY) */
        if(+data.removeMPRows == 1){
            doQuery(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.venta_idventa=${data.idventa};`)
        }
    }
    
    if(typeof data.removeCtaCteRow !== 'undefined'){
        if(+data.removeCtaCteRow == 1){
            doQuery(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.modo_pago = 'ctacte' and vhmp.venta_idventa=${data.idventa};`)
        }
    }

    doQuery(
        obtenerCajaAbierta(data.sucursal_idsucursal),((err,rows)=>{
            if(err)
            {
                callback(null)
                return
            }
            if(rows.length<1)
            {
                console.log("No hay caja!!!!!")
                callback(null)
                return
            }

            const idcaja=rows[0].idcaja

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
                ${connection.escape(idcaja)}, 
                ${connection.escape(data.usuario_idusuario)}, 
                ${typeof data.idcliente === 'undefined' ? 'null' : connection.escape(data.idcliente)}, 
                ${typeof data.idventa === 'undefined' ? 'null' : connection.escape(data.idventa)}, 
                ${data.monto - data.mp.ctacte_monto /* subtract ctacte monto */}, 
                ${connection.escape(data.tipo)},
                ${connection.escape(data.sucursal_idsucursal)},
                date('${data.fecha}')
                )`;


            //console.log("insert cobro")
            //console.log(JSON.stringify(__query))

            doQuery(__query,(err1, result1)=>{
                if(err1)
                    {
                        console.log(err1)
                        callback(-1)
                        return
                    }
                
                const idcobro = result1.insertId

                var _mp = []
                //#region PREPARACION
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
                        cant_cuotas: data.mp.tarjeta_tarjeta,
                        fk_tarjeta: data.mp.fk_tarjeta,
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
        
                _mp = add(
                    _mp,
                    get_mp_obj(
                        {
                            monto: data.mp.transferencia_monto,
                            tipo: 'transferencia',
                            fkbanco: data.mp.fk_banco_transferencia,
                        }
                    ),
                    "transferencia_monto"
                )
        
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
                    '${parseFloat(mp.cant_cuotas) * parseFloat(mp.monto_cuota)}',
                    ${connection.escape(mp.fk_tarjeta)}
                    )`
                    
                    if(mp.tipo!='ctacte')
                    {
                        total+=parseFloat(mp.monto);
                    }
                })
                //venta modo de pago
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
                            ${mp.monto_cuota},
                            ${connection.escape(mp.fk_tarjeta)})
                        `;
        
                    })
                }
                var ___query = `INSERT INTO cobro_has_modo_pago 
                (
                    cobro_idcobro,
                    modo_pago, 
                    banco_idbanco, 
                    mutual_idmutual, 
                    monto, 
                    cant_cuotas, 
                    monto_cuota, 
                    total_int,
                    fk_tarjeta

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
                    monto_cuota,
                    fk_tarjeta

                ) VALUES ` + _venta_mp_item;

               
                if(_venta_mp_item.length<1)
                {
                    doQuery(`UPDATE venta  v SET v.descuento=${data.descuento}, v.debe=v.subtotal-${data.descuento},  v.monto_total=v.subtotal-${data.descuento},  v.haber=v.haber + ${total}, v.saldo = v.saldo - ${total} WHERE v.idventa=${(data.idventa||"0")};`)
                    
                    if(_cobro_mp_item.length>0)
                    {
                        doQuery(___query,(err2, result2)=>{
                            callback(idcobro);
                        })
                    }
                    else{
                        callback(idcobro);
                    }
                    
                }
                else{
                    doQuery(___query,(err2, result2)=>{
                        if(err2)
                        {
                            console.log("error...........................")
                            callback(null)
                            return
                        }
                        if(typeof data.idventa !== 'undefined'){
                            //hope this works!!
                            doQuery(__query_venta_mp)
                            //UPDATE DEBE AND HABER FIELDS IN VENTA
                            doQuery(`UPDATE venta  v SET v.descuento=${data.descuento}, v.debe=v.subtotal-${data.descuento},  v.monto_total=v.subtotal-${data.descuento},  v.haber=v.haber + ${total}, v.saldo = v.saldo - ${total} WHERE v.idventa=${(data.idventa||"0")};`)
                        }
                        callback(idcobro);
                    })
                }

                //#endregion
                
            
            
            })

        })
    )


}

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
            //console.log("ELIMINAR MODO DE PAGOS")
            connection.query(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.venta_idventa=${data.idventa};`)
        }
    }

    if(typeof data.removeCtaCteRow !== 'undefined'){
        if(+data.removeCtaCteRow == 1){
            //console.log("ELIMINAR MODO DE PAGOS MP")
            connection.query(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.modo_pago = 'ctacte' and vhmp.venta_idventa=${data.idventa};`)
        }
    }
    //console.log("CREAR MODO DE PAGOS")
    connection.query(__query_venta_mp,(err,resp)=>{
        callback(0);
    })
    //UPDATE VENTA DESCUENTO Y SALDO

    connection.query(`UPDATE venta  v SET v.descuento=${data.descuento}, debe=v.subtotal-${data.descuento},  monto_total=v.subtotal-${data.descuento}  WHERE v.idventa=${data.idventa};`)

    connection.end()


    
}


const do_agregar_cobro = (data, callback) => {
    //console.log(JSON.stringify(data.mp))
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
        fk_tarjeta: typeof vars.fk_tarjeta === 'undefined' ? null : vars.fk_tarjeta,
    })

    /* solo si es modo de pago cta cte */

    if(data.monto == data.mp.ctacte_monto && data.mp.ctacte_monto>0){
        /*** en este caso, insertar venta modo de pago y retornar -1 al cliente     */
        agregar_venta_mp_ctacte(data,callback)
        return;//nothing else to do
    }
 
    

    /* REMOVE OLD MP ROWS! (ONLY IF NECESSARY) */
    if(typeof data.removeMPRows !== 'undefined'){
            if(+data.removeMPRows == 1){
                //connection.query(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.venta_idventa=${data.idventa};`)
                doQuery(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.venta_idventa=${data.idventa};`)

            }
        }
        
    if(typeof data.removeCtaCteRow !== 'undefined'){
        if(+data.removeCtaCteRow == 1){
            //connection.query(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.modo_pago = 'ctacte' and vhmp.venta_idventa=${data.idventa};`)
            doQuery(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.modo_pago = 'ctacte' and vhmp.venta_idventa=${data.idventa};`)
        }
    }

    const connection = mysql_connection.getConnection();
    connection.connect();

    //get caja!
    //console.log("Obteniendo caja...")
    connection.query(obtenerCajaAbierta(data.sucursal_idsucursal),(err,_rows)=>{
        if(err)
        {
            console.log(err)
            connection.end()
            callback(null)
            
            return
        }
        if(_rows.length<1)
        {
            console.log("No hay caja!!!!!")
            //connection.query(insertEvento("NULL CAJA (CLIENTE REF)",data.usuario_idusuario,data.sucursal_idsucursal,data.idcliente,"COBRO"))
            connection.end()
            callback(null)
            
            return
        }
        

        if(_rows[0].idcaja!=data.caja_idcaja)
        {
            console.log("<!> el nro de caja obtenida en el servidor no coincide con el recibido del cliente... ")
            //connection.query(insertEvento("CAJA ID MISMATCH (CLIENTE REF)",data.usuario_idusuario,data.sucursal_idsucursal,data.idcliente,"COBRO"))
        }

        const idcaja=_rows[0].idcaja

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
            ${connection.escape(idcaja)}, 
            ${connection.escape(data.usuario_idusuario)}, 
            ${typeof data.idcliente === 'undefined' ? 'null' : connection.escape(data.idcliente)}, 
            ${typeof data.idventa === 'undefined' ? 'null' : connection.escape(data.idventa)}, 
            ${data.monto - data.mp.ctacte_monto /* subtract ctacte monto */}, 
            ${connection.escape(data.tipo)},
            ${connection.escape(data.sucursal_idsucursal)},
            date('${data.fecha}')
            )`;
        //#region save data
        connection.query(
            __query,
            (err,results)=>{

                if(err)
                {
                    console.log(err)
                    callback(-1)
                    return
                }
            
                const idcobro = results.insertId
                //PAGO GUARDADO, PREPARAR MODOS DE PAGOS Y VENTA MODO PAGO
                var _mp = []
                //#region PREPARACION
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
                        cant_cuotas: data.mp.tarjeta_tarjeta,
                        fk_tarjeta: data.mp.fk_tarjeta,
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
        
                _mp = add(
                    _mp,
                    get_mp_obj(
                        {
                            monto: data.mp.transferencia_monto,
                            tipo: 'transferencia',
                            fkbanco: data.mp.fk_banco_transferencia,
                        }
                    ),
                    "transferencia_monto"
                )
        
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
                    '${parseFloat(mp.cant_cuotas) * parseFloat(mp.monto_cuota)}',
                    ${connection.escape(mp.fk_tarjeta)}
                    )`
                    
                    if(mp.tipo!='ctacte')
                    {
                        total+=parseFloat(mp.monto);
                    }
                })
                //venta modo de pago
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
                            ${mp.monto_cuota},
                            ${connection.escape(mp.fk_tarjeta)})
                        `;
        
                    })
                }
                //#endregion
                
                //FIN DE PREPARACION...
                var ___query = `INSERT INTO cobro_has_modo_pago 
                (
                    cobro_idcobro,
                    modo_pago, 
                    banco_idbanco, 
                    mutual_idmutual, 
                    monto, 
                    cant_cuotas, 
                    monto_cuota, 
                    total_int,
                    fk_tarjeta

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
                    monto_cuota,
                    fk_tarjeta

                    ) VALUES ` + _venta_mp_item;

        /**
         * insert venta modo de pago...
         */
                connection.query(___query,(err,_results)=>{
                    
                    if(typeof data.idventa !== 'undefined'){
                        //hope this works!!
                        connection.query(__query_venta_mp,(err,___results)=>{})
                        //UPDATE DEBE AND HABER FIELDS IN VENTA
                        connection.query(`UPDATE venta  v SET v.descuento=${data.descuento}, v.debe=v.subtotal-${data.descuento},  v.monto_total=v.subtotal-${data.descuento},  v.haber=v.haber + ${total}, v.saldo = v.saldo - ${total} WHERE v.idventa=${data.idventa};`)
                    }
                    callback(idcobro);
                    connection.end();  
                })
            //SAVE VENTA MP!, THESE HAVE BEEN DELETED BEFORE... (ONLY IN INGRESO)
            }
        );

            //#endregion
    })
}

const agregar_cobro  = (data,callback) => {

    //UsuarioDB.validar_usuario_be({tk:data.tk},()=>{do_agregar_cobro(data,callback)},()=>{callback({msg:"error VALIDANDO USUARIO"})})
    do_agregar_cobro_v2(data,callback)
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
        cobro_queries.queryDetalleCobro(connection.escape(idcobro)),(err,results)=>{
            return callback(results);
        }
    );
    connection.end();
}

const lista_mp_cobro = (idcobro, callback) => {
    
    const connection = mysql_connection.getConnection();
    const query = `
    SELECT 
    cmp.* ,
    if(t.idtarjeta is null, '', t.nombre) as 'tarjeta',
    if(m.idmutual is null, '', m.nombre) as 'mutual'
    FROM 
    cobro_has_modo_pago cmp 
        left join tarjeta t on t.idtarjeta=cmp.fk_tarjeta
        left join mutual m on m.idmutual = cmp.mutual_idmutual
    WHERE cmp.cobro_idcobro=${connection.escape(idcobro)};`
    connection.connect();
    //console.log(query)
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end();

}


const anular_cobro = (data, callback) => {
    
    const connection = mysql_connection.getConnection()
    const query = `update cobro c set c.anulado = 1 where c.idcobro = ${connection.escape(data.idcobro)}`
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