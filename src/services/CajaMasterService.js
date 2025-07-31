const db = require('../database/CajaMaster');

const getBalance = (idsucursal, callback) => {
    db.getBalance(idsucursal, (response)=>{
        callback(response);
    });
};

module.exports = {
    getBalance,
};