const mysql_connection = require("../lib/mysql_connection")



const obtener_facturas = (idprov,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`SELECT f.*, p.nombre AS 'proveedor',  date_format(f.fecha,'%d-%m-%y') as 'fecha_formated' 
    FROM factura f, proveedor p 
    WHERE f.proveedor_idproveedor = p.idproveedor AND 
    (case when '-1'<>'${idprov}' then f.proveedor_idproveedor = ${idprov} else true end)
    ;`,(err,rows)=>{
        callback(rows)
    })
    connection.end();
}

const agregar_factura = (data,callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(
        `INSERT INTO factura (numero, proveedor_idproveedor, monto, cantidad) VALUES ('${data.numero}', ${data.proveedor_idproveedor},${data.monto},${data.cantidad});`,(err,result)=>{
        callback(result.insertId)
    })
    connection.end();
}

const detalle_factura = (data, callback) => {
    const  connection = mysql_connection.getConnection();
    connection.connect();

    connection.query(`SELECT 
    DATE_FORMAT(f.fecha, '%d-%m-%y') AS 'fecha',
    f.numero,
    f.cantidad,
    f.monto,
    f.proveedor_idproveedor,
    p.nombre as 'proveedor',
    f.es_remito
    FROM 
    factura f, 
    proveedor p 
    WHERE p.idproveedor = f.proveedor_idproveedor AND f.idfactura = ${data};`,(err,rows)=>{
        callback(rows)
    });
    connection.end();
}

const lista_elementos_factura = (data, callback) => {
    const connection = mysql_connection.getConnection();
    connection.connect();
    connection.query(`SELECT 
    c.codigo,
    cf.cantidad,
    cf.costo
     FROM codigo_factura cf, codigo c WHERE
    cf.stock_codigo_idcodigo = c.idcodigo AND
    cf.factura_idfactura=${data};`, (err,rows)=>{
        callback(rows)
    })
    connection.end();
}

const agregar_factura_v2 = (data, callback) => {

    const connection = mysql_connection.getConnection()
    connection.connect()

    
    let query_factura = `INSERT INTO factura (numero, proveedor_idproveedor, monto, cantidad, tipo, punto_venta, es_remito  ) VALUES (
    ${connection.escape(data.nro)}, 
    ${connection.escape(data.fkproveedor)},
    ${connection.escape(data.total)},
    ${connection.escape(data.cant_productos)},
    ${connection.escape(data.tipo)},
    ${connection.escape(data.puntoVenta)}, 
    ${connection.escape(data.esremito)});` //toDo
    
    console.log(query_factura)

    let query_iva = `INSERT INTO factura_iva (fk_factura, monto, tipo) VALUES `
    let query_retenciones = `INSERT INTO factura_retencion (fk_factura, monto, tipo) VALUES `
    let query_percepciones = `INSERT INTO factura_percepcion (fk_factura, monto) VALUES `
    let idfactura=-1;

    const _process = (_queries) => {
        if(_queries.length<1)
        {
            connection.end()
            callback(idfactura)
            return
        }
        const query = _queries.pop()
        connection.query(query,(err,resp)=>{
            _process(_queries)
        })
    }

    //first insert factura
    connection.query(query_factura,(err,result)=>{
        
        let idfactura=result.insertId
        let _iva = ""
        let _retenciones = ""
        let _percepciones =""
        

        data
        .iva
        .forEach(row=>{_iva += (_iva.length>0?',':'') + `(${idfactura}, ${connection.escape(row.monto)}, ${connection.escape(row.tipo)})`});

        data
        .retenciones
        .forEach(row=>{_retenciones += (_retenciones.length>0?',':'') + `(${idfactura}, ${connection.escape(row.monto)})`});

        data
        .percepciones
        .forEach(row=>{_percepciones += (_percepciones.length>0?',':'') + `(${idfactura}, ${connection.escape(row.monto)}, ${connection.escape(row.tipo)})`});

        let queries=[]

        if(data.iva.length>0)
        {
            queries.push(query_iva + _iva)
        }

        if(data.retenciones.length>0)
        {
            queries.push(query_retenciones + _retenciones)
        }

        if(data.percepciones.length>0)
        {
            queries.push(query_percepciones + _percepciones)
        }
        console.log(JSON.stringify(queries))
        
        _process(queries)

    })
}

const obtener_factura_por_nro = (nro, callback) =>{
    const query = `select * from factura f where f.numero = ${nro}}`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const obtener_facturas_filtros = (data, callback) =>{
    //console.log(JSON.stringify(data))

    const provids = data.idprovs.length<1 ? ['0'] : data.idprovs
    const from = data.desde == "" ? "2000-01-01" : data.desde
    const to = data.hasta =="" ? "2000-01-01" : data.hasta
    var _q = +data.ver_facturas == 1 ? ' f.es_remito=0 ' : ''
    _q += _q.length>0 ? (+data.ver_remitos ==1 ? ' or f.es_remito=1 ' : '') :( +data.ver_remitos==1 ? ' f.es_remito=1' : ' f.es_remito=-1 ')


    const query =`SELECT DATE_FORMAT(f.fecha,'%d-%m-%y') AS 'fecha_f', f.*, p.nombre AS 'proveedor' FROM factura f, proveedor p WHERE
                p.idproveedor=f.proveedor_idproveedor and 
                (case when '${data.idprovs.length}'<>'0' then f.proveedor_idproveedor IN (${provids.map(id=>id)}) ELSE TRUE END) AND 
                (case when '${data.desde}'<>'' then DATE(f.fecha)>=DATE('${from}') ELSE TRUE END ) AND 
                (case when '${data.hasta}'<>'' then DATE(f.fecha)<=DATE('${to}') ELSE TRUE END ) AND 
                (${_q})
                ;  
                `;
    //console.log(query)
    
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,rows)=>{
        callback(rows)
    })
    connection.end()
}

module.exports = {
    obtener_facturas_filtros,
    obtener_factura_por_nro,
    obtener_facturas,
    agregar_factura,
    detalle_factura,
    lista_elementos_factura,
    agregar_factura_v2,
}