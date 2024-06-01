const mysql_connection = require("../lib/mysql_connection")


const eliminar_etiquetas = (data, callback) => {
    let _codigos_delete  = ""
    data.codigos.forEach(c=>{
        _codigos_delete+=_codigos_delete.length<1 ? '' : ',' + c
    })
    const _query_delete = `DELETE FROM codigo_has_tag WHERE codigo_has_tag.fk_codigo IN (${_codigos_delete})`
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(_query_delete,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const agregar_codigo_tag = (data, callback) => {
    let values = ''
    console.log(JSON.stringify(data))
    data.codigos.forEach(c=>{
        console.log("ksdfjk")
        data.tags.forEach(t=>{
            console.log("ddeee")
            values += (values.length<1 ? '' : ',') + `(${c},'${t}')`
        })
    })
    const query = `INSERT ignore INTO codigo_has_tag (fk_codigo, fk_etiqueta) VALUES ${values};`
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const agregar_tag = (data, callback) => {
    const query = `INSERT INTO tag (etiqueta, fk_categoria) VALUES ('${data.etiqueta}', ${data.fkcategoria});`
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const obtener_lista_tag = (data, callback) => {

    const query = `SELECT t.* FROM tag t WHERE (case when '${data.fkcategoria}'<>'-1' then t.fk_categoria = '${data.fkcategoria}' ELSE TRUE END ) ORDER BY t.etiqueta ASC;`

    //console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

const agregar_categoria = (data,callback) => {
    const query = `INSERT INTO tag_categoria (fk_parent, nombre) VALUES (${+data.fkparent<0 ? "NULL" : data.fkparent}, '${data.nombre}');`
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}
 
const obtener_lista_categorias = (callback) => {
    const query = `SELECT * FROM tag_categoria;`
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}
 
const obtener_lista_tag_codigo = (data,callback) => {
    const query = `SELECT cht.* FROM codigo_has_tag cht where cht.fk_codigo=${data.idcodigo};`
    console.log(query)
    const connection = mysql_connection.getConnection()
    connection.connect()
    connection.query(query,(err,resp)=>{
        callback(resp)
    })
    connection.end()
}

module.exports = {
    agregar_categoria, 
    agregar_tag, 
    obtener_lista_categorias, 
    obtener_lista_tag, 
    agregar_codigo_tag, 
    obtener_lista_tag_codigo,
    eliminar_etiquetas,
}