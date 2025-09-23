const obtenerCajaAbierta = (idsucursal) => `select * from caja c where c.sucursal_idsucursal=${idsucursal} and c.estado='ABIERTA';`;
const obtenerFFSucursal = (idsucursal) => `select * from caja c where c.sucursal_idsucursal=${idsucursal} and c.estado='ABIERTA' and c.nro=2;`
module.exports = {obtenerCajaAbierta, obtenerFFSucursal}