const queryObtenerClientebyDNI =(dni)=>{
    return `SELECT c.*, 
    CONCAT(c.apellido,', ', c.nombre) AS 'nombre_completo' 
    FROM cliente c WHERE c.dni='${dni}';`;
} 

const queryObtenerClientebyID =(id)=>{
    return `SELECT c.*, 
    CONCAT(c.apellido,', ', c.nombre) AS 'nombre_completo',
    date_format(c.fecha_nacimiento,'%d-%m-%Y') as 'fecha_nacimiento_f'
     FROM cliente c WHERE c.idcliente=${id};`;
} 

const queryObtenerListaClientes = () => {
    return `SELECT c.*, 
    CONCAT(c.apellido,', ', c.nombre) AS 'nombre_completo'
     FROM cliente c where c.destinatario=0;`;
}

const queryAgregarCliente = () => {
    return `INSERT INTO cliente (
        localidad_idlocalidad, 
        nombre, 
        apellido, 
        direccion, 
        dni, 
        telefono1, 
        telefono2,
        destinatario) values (?)`;
}

module.exports = {
    queryObtenerClientebyDNI,
    queryObtenerClientebyID,
    queryObtenerListaClientes,
    queryAgregarCliente
}

