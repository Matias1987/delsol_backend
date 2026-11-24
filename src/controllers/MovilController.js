const service = require("../services/MovilService");

const insert = (req, res) => {
  const { body } = req;
  service.insert(body, (response) => {
    res.send({ status: "OK", data: response });
  });
};

module.exports = { insert };
