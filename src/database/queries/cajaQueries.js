const obtenerCajaAbierta = (idsucursal) => `select * from caja c where c.sucursal_idsucursal=${idsucursal} and c.estado='ABIERTA';`;

module.exports = {obtenerCajaAbierta}