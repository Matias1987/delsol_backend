const mysql_connection = require("../../lib/mysql_connection")
const pool = require("../../lib/spool")
module.exports = {
    /*doQuery: (query, callback) => {
        const connection = mysql_connection.getConnection()
        connection.connect()
        connection.query(query,(err,resp)=>{
            if(err)
            {
                return callback?.({err})
            }

            callback?.({data:resp})
        });
        connection.end();
    },*/

    doQuery: async (query, callback) => {
        try {
            const [rows, fields] = await pool.query(query);
            callback?.({ data: rows });
        } catch (error) {
            callback?.({ err: error });
        }
    },


    escapeHelper: (data) => {
        const connection = mysql_connection.getConnection()
        return connection.escape(data)
    }
}