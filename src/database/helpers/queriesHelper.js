const mysql_connection = require("../../lib/mysql_connection")
module.exports = {
    doQuery: (query, callback) => {
        const connection = mysql_connection.getConnection()
        connection.connect()
        connection.query(query,(err,resp)=>{
            if(err)
            {
                return callback?.({err})
            }

            callback?.({data:resp})
        })
    }
}