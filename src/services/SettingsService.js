const db = require("../database/Settings")

const addUpdateSetting = (data,callback) => {
    db.addUpdateSetting(data,response=>{
        callback(response)
    })
}

const getSettings = (data, callback) => {
    db.getSettings(data,response=>{
        callback(response)
    })
}

module.exports={
    addUpdateSetting,
    getSettings
}