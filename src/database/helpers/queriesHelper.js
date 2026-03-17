const mysql_connection = require("../../lib/mysql_connection");
const pool = require("../../lib/spool");
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

  escapeHelper: (val) => {
    if (val === null || val === undefined) return "NULL";

    switch (typeof val) {
      case "number":
        return val.toString();
      case "boolean":
        return val ? "TRUE" : "FALSE";
      case "object":
        if (val instanceof Date) {
          return `'${val.toISOString().slice(0, 19).replace("T", " ")}'`;
        }
        return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
      default: // string
        return `'${val.replace(/\\/g, "\\\\").replace(/'/g, "''")}'`;
    }
  },
};
