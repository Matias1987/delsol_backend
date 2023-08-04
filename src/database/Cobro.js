const mysql_connection = require("../lib/mysql_connection");
const cobro_queries = require("./queries/cobroQueries");

const agregar_cobro  = (data,callback) => {

    /*
        tipo: cuota, adelanto
        si cuota: idcliente (id venta is null or undefined --todo?)
        si adelanto: idventa
    */

    console.log(JSON.stringify(data))

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
    /**
     * FALTA CREAR EL OBJETO PARA VENTA MODO PAGO CUANDO EXISTE EL ID VENTA !!!!!!!
     */

    

    /* 
    `(
    ${venta_id},
    ${p.modo_pago_idmodo_pago},
    ${p.banco_idbanco},
    ${p.mutual_idmutual},
    ${p.monto},
    ${p.monto_int},
    ${p.cant_cuotas},
    ${p.monto_cuota})`
    */

    //check if 
    const __query = `insert into cobro (            
        caja_idcaja,
        usuario_idusuario,
        cliente_idcliente,
        venta_idventa,
        monto,
        tipo,
        sucursal_idsucursal
        ) values (
        ${data.caja_idcaja}, 
        ${data.usuario_idusuario}, 
        ${typeof data.idcliente === 'undefined' ? 'null' : data.idcliente}, 
        ${typeof data.idventa === 'undefined' ? 'null' : data.idventa}, 
        ${data.monto}, 
        '${data.tipo}',
        ${data.sucursal_idsucursal}
        )`;

    console.log(__query)

    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        __query,
        (err,results)=>{
            console.log(results)
        const idcobro = results.insertId
       console.log("payment saved with id: " + idcobro);

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
                cant_cuotas: data.mp.cant_cuotas,
                monto_cuota: data.mp.monto_cuota,
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

            console.log("ALL MP:  "  + JSON.stringify(_mp))

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


        console.log(__query_venta_mp)

        connection.query(__query,(err,_results)=>{
            return callback(idcobro);
        })

        if(typeof data.idventa !== 'undefined'){
            //hope this works!!
            connection.query(__query_venta_mp,(err,___results)=>{
                //return callback(idcobro);
            })

            console.log(`UPDATE venta  v SET v.haber=v.haber + ${total}, v.saldo = v.saldo - ${total} WHERE v.idventa=${data.idventa};`)
            connection.query(`UPDATE venta  v SET v.haber=v.haber + ${total}, v.saldo = v.saldo - ${total} WHERE v.idventa=${data.idventa};`)
        }

        connection.end();            
        }
    );
    
}

const lista_cobros = (data, callback) => {
    const _idcliente = typeof data.idcliente === 'undefined' ? '' : data.idcliente

    console.log(`SELECT 
    c.* , 
    date_format(c.fecha,'%d-%m-%Y') as 'fecha_formatted',
    cl.dni AS 'cliente_dni',  
    CONCAT(cl.apellido,', ', cl.nombre) AS 'cliente_nombre'
    FROM cobro c, cliente cl 
    WHERE 
    c.cliente_idcliente = cl.idcliente and
    (case when '' <> '${_idcliente}' then '${_idcliente}' = c.cliente_idcliente ELSE TRUE end)
    order by c.idcobro desc;`)

    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        `SELECT 
        c.* , 
        date_format(c.fecha,'%d-%m-%Y') as 'fecha_formatted',
        cl.dni AS 'cliente_dni',  
        CONCAT(cl.apellido,', ', cl.nombre) AS 'cliente_nombre'
        FROM cobro c, cliente cl 
        WHERE 
        c.cliente_idcliente = cl.idcliente and
        (case when '' <> '${_idcliente}' then '${_idcliente}' = c.cliente_idcliente ELSE TRUE end)
        order by c.idcobro desc;`,
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
    console.log(cobro_queries.queryDetalleCobro(idcobro))
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
    console.log(query)
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end();

}


module.exports = {
    agregar_cobro,
    lista_cobros,
    detalle_cobro,
    lista_mp_cobro,
}