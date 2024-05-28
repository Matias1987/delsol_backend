const mysql_connection = require("../lib/mysql_connection")

const agregar_codigo_tag = (data, callback) => {
    const query = `INSERT INTO codigo_has_tag (fk_codigo, fk_etiqueta) VALUES (${data.codigo}, '${data.etiqueta}');`
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

    console.log(query)
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
 
const obtener_lista_tag_codigo = (callback) => {
    const query = `SELECT * FROM tag_categoria;`
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
    obtener_lista_tag_codigo}