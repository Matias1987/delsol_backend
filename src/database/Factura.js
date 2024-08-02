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
    p.nombre as 'proveedor'
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
    console.log(JSON.stringify(data))
    let query_factura = `INSERT INTO factura (numero, proveedor_idproveedor, monto, cantidad, tipo, punto_venta) VALUES ('${data.nro}', ${data.fkproveedor},${data.total},${0},'${data.tipo}','${data.puntoVenta}');` //toDo
    let query_iva = `INSERT INTO factura_iva (fk_factura, monto) VALUES `
    let query_retenciones = `INSERT INTO factura_retencion (fk_factura, monto) VALUES `
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
            _process(queries)
        })
    }

    //first insert factura
    connection.query(query_factura,(err,resp)=>{
        
        idfactura = resp.insertId;
        
        params
        .iva
        .forEach(row=>{query_factura += (query_factura.length>0?',':'') + `(${idfactura}, ${row.monto})`});

        params
        .retenciones
        .forEach(row=>{query_retenciones += (query_retenciones.length>0?',':'') + `(${idfactura}, ${row.monto})`});

        params
        .percepciones
        .forEach(row=>{query_percepciones += (query_percepciones.length>0?',':'') + `(${idfactura}, ${row.monto})`});

        let queries=[]

        if(params.iva.length>0)
        {
            queries.push(query_iva)
        }

        if(params.retenciones.length>0)
        {
            queries.push(query_retenciones)
        }

        if(params.percepciones.length>0)
        {
            queries.push(query_percepciones)
        }
        
        _process(queries)

    })
}

module.exports = {
    obtener_facturas,
    agregar_factura,
    detalle_factura,
    lista_elementos_factura,
    agregar_factura_v2,
}