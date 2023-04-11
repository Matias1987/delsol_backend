const queryListaEnvioStock = (idenvio) => {
    return `SELECT 
            ehs.idenvio_has_stock,
            ehs.cantidad,
            c.codigo,
            c.descripcion,
            c.idcodigo
            FROM 
            envio_has_stock ehs,
            codigo c
            WHERE 
            ehs.codigo_idcodigo = c.idcodigo and
            ehs.envio_idenvio = ${idenvio};`;
}

const queryDetalleEnvio = (id) => {
    return `SELECT 
    e.idenvio,
	e.cantidad_total,
	DATE_FORMAT(e.fecha,'%d-%m-%Y') AS 'fecha',
	s.nombre AS 'sucursal',
	u.nombre AS 'usuario' 
    FROM envio e, sucursal s, usuario u WHERE 
    e.sucursal_idsucursal=s.idsucursal AND
    e.usuario_idusuario = u.idusuario AND 
    e.idenvio=${id};`;
}
const queryListaEnvios = () => {
    return ``;
}
const queryListaEnviosSucursal = (idSucursal) => {
    return ``;
}

const queryAgregarEnvio = () => {
    return `insert into envio (
        sucursal_idsucursal
        usuario_idusuario
        cantidad_total)
        values (?)`;
}

module.exports = {
    queryAgregarEnvio,
    queryDetalleEnvio,
    queryListaEnvios,
    queryListaEnviosSucursal,
    queryListaEnvioStock,
}