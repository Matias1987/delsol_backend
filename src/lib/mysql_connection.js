const mysql = require("mysql2");
const _global_vars = require("./global");

const getConnection = () =>{
    return mysql.createConnection(
        {
            host: _global_vars.connection_data.host,
            user: _global_vars.connection_data.user,
            password: _global_vars.connection_data.password,
            database: _global_vars.connection_data.database
        }
    );
}

module.exports = {
    getConnection
}