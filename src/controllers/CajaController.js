const cajaService = require("../services/CajaService");

const validar_usuario_caja = ({id_usuario, idsucursal, token}, callback) => {
  //for now return true, but in the future we will check if the user has permissions to open a caja
  return callback(true);
};

const caja_exists = (req, res) => {
  const { body } = req;
  cajaService.caja_exists(body, (rows) => {
    res.status(201).send({ status: "OK", data: rows });
  });
};

const obtener_caja = (req, res) => {
  const {
    params: { idsucursal },
  } = req;
  cajaService.obtener_caja(idsucursal, (resp) => {
    res.status(201).send({ status: "OK", data: resp });
  });
};

const obtenerCajasSucursal = (req, res) => {
  const {
    params: { idsucursal },
  } = req;
  cajaService.obtenerCajasSucursal(idsucursal, (rows) => {
    res.status(201).send({ status: "OK", data: rows });
  });
};

const agregarCaja = (req, res) => {
  const { body } = req;

  validar_usuario_caja(body, (isValid) => {
    if (!isValid) {
      return res.status(403).send({
        status: "Error",
        data: { message: "User is not authorized to open a caja" },
      });
    }

    cajaService.agregarCaja(body, (id) => {
      res.status(201).send({ status: "OK", data: id });
    });
  });
};

const cerrarCaja = (req, res) => {
  const {
    params: { idcaja },
  } = req;
  cajaService.cerrarCaja(idcaja, (resp) => {
    res.status(201).send({ status: "OK", data: resp });
  });
};

const informe_caja = (req, res) => {
  const {
    params: { idcaja },
  } = req;

  cajaService.informe_caja(idcaja, (resp) => {
    res.status(201).send({ status: "OK", data: resp });
  });
};

const obtener_caja_id = (req, res) => {
  const {
    params: { idcaja },
  } = req;

  cajaService.obtener_caja_id(idcaja, (resp) => {
    res.status(201).send({ status: "OK", data: resp });
  });
};

const caja_abierta = (req, res) => {
  const {
    params: { idsucursal },
  } = req;

  cajaService.caja_abierta(idsucursal, (resp) => {
    res.status(201).send({ status: "OK", data: resp });
  });
};

const resumen_caja = (req, res) => {
  const {
    params: { idsucursal },
  } = req;

  cajaService.resumen_caja({ idsucursal: idsucursal }, (response) => {
    res.status(201).send({ status: "OK", data: response });
  });
};

const obtener_cajas_fecha = (req, res) => {
  const { body } = req;
  //console.log(JSON.stringify(body));
  cajaService.obtener_cajas_fecha(body.fecha, (resp) => {
    res.status(201).send({ status: "OK", data: resp });
  });
};

const cambiar_estado_caja = (req, res) => {
  const {
    body: { idcaja, estado },
  } = req;

  console.log(idcaja, estado);
  cajaService.cambiar_estado_caja({ idcaja, estado }, (resp) => {
    res.status(201).send({ status: "OK", data: resp });
  });
};

module.exports = {
  obtenerCajasSucursal,
  agregarCaja,
  cerrarCaja,
  obtener_caja,
  informe_caja,
  obtener_caja_id,
  caja_abierta,
  caja_exists,
  resumen_caja,
  obtener_cajas_fecha,
  cambiar_estado_caja,
};
