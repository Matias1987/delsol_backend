const service = require("../services/ImageService");

const register_image = (req, res) => {
  console.log("trying to upload an image.......");
  const { body } = req;

  service.agregar_imagen(
    { fk_ref: body.fk_ref, fname: body.fname, tipo: body.tipo },
    (response) => {
      res.status(201).send({ status: "OK", data: response });
    },
  );
};

const get_images_ref = (req, res) => {
  const { body } = req;
  service.obtener_imagenes(
    { fk_ref: body.fk_ref, tipo: body.tipo },
    (response) => {
      res.status(201).send({ status: "OK", data: response });
    },
  );
};

const get_default_image = (req, res) => {
  const {
    params: { idproducto },
  } = req;
  console.log(idproducto);
  service.get_default_image({ idproducto: idproducto }, (response) => {
    res.status(201).send({ status: "OK", data: response });
  });
};

const remover_imagen = (req, res) => {
  const { body } = req;
  service.remover_imagen(body, (resp) => {
    res.status(201).send({ status: "OK", data: resp });
  });
};

const marcar_default = (req, res) => {
  const { body } = req;
  service.marcar_default(body, (resp) => {
    res.status(201).send({ status: "OK", data: resp });
  });
};
module.exports = {
  register_image,
  get_images_ref,
  get_default_image,
  remover_imagen,
  marcar_default,
};
