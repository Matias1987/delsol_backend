const queryListaEnvioStock = (idenvio) => {
    return ``;
}

const queryDetalleEnvio = (id) => {
    return ``;
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