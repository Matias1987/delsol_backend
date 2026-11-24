const db = require("../database/Movil");

const insert = (data, callback) => {
  db.insert(data, (response) => {
    callback(response);
  });
};

module.exports = { insert };
