const mysql_connection = require("../lib/mysql_connection")

const addUpdateSetting = (data,callback) => {
    const connection =mysql_connection.getConnection()

    const query = `INSERT INTO settings (s_key, s_value) 
    VALUES (${connection.escape(data.key)},${connection.escape(data.value)}) 
    on duplicate key update s_value=${connection.escape(data.value)}
    ;`
    console.log(query)
    connection.connect()

    connection.query(query,(err,resp)=>{
        if(err)
        {
            return callback({err:1})

        }

        callback(resp)
    })

    connection.end()

    
}

const getSettings = (data, callback) => {
    const connection =mysql_connection.getConnection()
    const query = `select * from settings;`
    console.log(query)
    connection.connect()

    connection.query(query,(err,resp)=>{
        if(err)
        {
            return callback({err:1})

        }

        callback(resp)
    })

    connection.end()

    
}

module.exports={
    addUpdateSetting,
    getSettings
}