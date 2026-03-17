const mysql_connection = require("../lib/mysql_connection");
const { obtenerCajaAbierta } = require("./queries/cajaQueries");
const cobro_queries = require("./queries/cobroQueries");
const { doQuery, escapeHelper } = require("./helpers/queriesHelper");

const doQuery2 = (query, callback=null) => {
    doQuery(query, (response)=>{
        callback?.(!response ? {error:true} : null, response.data);
    })
}

const do_agregar_cobro_v2 = (data , callback) => {

    const add = (arr,val,idx) => parseFloat(val.monto) == 0 ? arr : [...arr,val]
    
    const get_mp_obj = vars => ({
        monto: isNaN(vars.monto) ? 0 : vars.monto,
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
            doQuery2(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.venta_idventa=${data.idventa};`)
        }
    }
    
    if(typeof data.removeCtaCteRow !== 'undefined'){
        if(+data.removeCtaCteRow == 1){
            doQuery2(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.modo_pago = 'ctacte' and vhmp.venta_idventa=${data.idventa};`)
        }
    }

    doQuery2(
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
                ${escapeHelper(idcaja)}, 
                ${escapeHelper(data.usuario_idusuario)}, 
                ${typeof data.idcliente === 'undefined' ? 'null' : escapeHelper(data.idcliente)}, 
                ${typeof data.idventa === 'undefined' ? 'null' : escapeHelper(data.idventa)}, 
                ${data.monto - data.mp.ctacte_monto /* subtract ctacte monto */}, 
                ${escapeHelper(data.tipo)},
                ${escapeHelper(data.sucursal_idsucursal)},
                date('${data.fecha}')
                )`;


            doQuery2(__query,(err1, result1)=>{
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
                        fkbanco: data.mp.fk_banco
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

                //this one is new........
                _mp = add(
                    _mp,
                    get_mp_obj({
                        monto: data.mp.tarjeta1_monto,
                        tipo: 'tarjeta',
                        cant_cuotas: data.mp.tarjeta1_tarjeta,
                        fk_tarjeta: data.mp.fk_tarjeta1,
                    }),
                    "tarjeta1_monto");
        
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
                    ${escapeHelper(mp.fk_tarjeta)}
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
                            ${escapeHelper(mp.fk_tarjeta)})
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
                    doQuery2(`UPDATE venta  v SET v.descuento=${data.descuento}, v.debe=v.subtotal-${data.descuento},  v.monto_total=v.subtotal-${data.descuento},  v.haber=v.haber + ${total}, v.saldo = v.saldo - ${total} WHERE v.idventa=${(data.idventa||"0")};`)
                    
                    if(_cobro_mp_item.length>0)
                    {
                        doQuery2(___query,(err2, result2)=>{
                            callback(idcobro);
                        })
                    }
                    else{
                        callback(idcobro);
                    }
                    
                }
                else{
                    doQuery2(___query,(err2, result2)=>{
                        if(err2)
                        {
                            console.log("error...........................")
                            callback(null)
                            return
                        }
                        if(typeof data.idventa !== 'undefined'){
                            //hope this works!!
                            doQuery2(__query_venta_mp)
                            //UPDATE DEBE AND HABER FIELDS IN VENTA
                            doQuery2(`UPDATE venta  v SET v.descuento=${data.descuento}, v.debe=v.subtotal-${data.descuento},  v.monto_total=v.subtotal-${data.descuento},  v.haber=v.haber + ${total}, v.saldo = v.saldo - ${total} WHERE v.idventa=${(data.idventa||"0")};`)
                        }
                        else{
                            console.log("no id venta defined...");
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
    

    if(typeof data.removeMPRows !== 'undefined'){
        if(+data.removeMPRows == 1){
            connection.query(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.venta_idventa=${data.idventa};`)
        }
    }

    if(typeof data.removeCtaCteRow !== 'undefined'){
        if(+data.removeCtaCteRow == 1){
            doQuery2(`DELETE FROM venta_has_modo_pago vhmp WHERE vhmp.modo_pago = 'ctacte' and vhmp.venta_idventa=${data.idventa};`,()=>{});
        }
    }
    doQuery2(__query_venta_mp,(err,resp)=>{
        callback(0);
    })

    doQuery2(`UPDATE venta  v SET v.descuento=${data.descuento}, debe=v.subtotal-${data.descuento},  monto_total=v.subtotal-${data.descuento}  WHERE v.idventa=${data.idventa};`);
    
}


const agregar_cobro  = (data,callback) => {

    do_agregar_cobro_v2(data,callback)
}

const lista_cobros = (data, callback) => {
    const _idcliente = typeof data.idcliente === 'undefined' ? '' : data.idcliente
    const _idventa = typeof data.idventa === 'undefined' ? '' : data.idventa
    const _idsucursal = typeof data.idsucursal === 'undefined' ? '' : data.idsucursal
    const _idcobro = typeof data.idcobro === 'undefined' ? '' : data.idcobro
    const _fecha = typeof data.fecha === 'undefined' ? '' : data.fecha
    const _anulado = typeof data.anulado === 'undefined'? '' : data.anulado

    
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
    limit 1000;`
    //console.log(_q);
    doQuery2(
        _q,
        (err,results)=>{
            callback(results);
        }
    );
}

const detalle_cobro = (idcobro, callback) => {
    doQuery2(cobro_queries.queryDetalleCobro(idcobro), (err, results) => {
        callback(results)
    });
}

const lista_mp_cobro = (idcobro, callback) => {

    const query = `
    SELECT 
    cmp.* ,
    if(t.idtarjeta is null, '', t.nombre) as 'tarjeta',
    if(m.idmutual is null, '', m.nombre) as 'mutual',
    if(bco.idbanco is null, '', bco.nombre) as 'banco' 
    FROM 
    cobro_has_modo_pago cmp 
        left join tarjeta t on t.idtarjeta=cmp.fk_tarjeta
        left join mutual m on m.idmutual = cmp.mutual_idmutual
        left join banco bco on bco.idbanco = cmp.banco_idbanco 
    WHERE cmp.cobro_idcobro=${escapeHelper(idcobro)};`

    doQuery2(query, (err, rows) => {
        callback(rows)
    });
}

//anular cobro
const anular_cobro = ({idcobro}, callback) =>{

	const update_cobro_query = `update cobro c set c.anulado=1 where c.idcobro = ${idcobro}`;

	const update_venta_query = `
		update venta v inner join cobro c on c.venta_idventa = v.idventa and  c.idcobro = ${idcobro} 
		set  v.haber = cast( v.haber as float )- c.monto, v.saldo = cast(v.saldo as float) + c.monto limit 1`;
		
	doQuery2(update_cobro_query, response=>{
		
		doQuery2(update_venta_query, resp1=>{
			callback(resp1)
		})

	})

}

module.exports = {
    agregar_cobro,
    lista_cobros,
    detalle_cobro,
    lista_mp_cobro,
    anular_cobro,
}