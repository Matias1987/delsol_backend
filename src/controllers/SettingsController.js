const service = require("../services/SettingsService")

const addUpdateSetting = (req, res) => {
 const {body} = req
 service.addUpdateSetting(body,response=>{
    res.status(201).send({status:"OK", data:response})
 })
}

const getSettings = (req, res) => {
 service.getSettings({},response=>{
    res.status(201).send({status:"OK", data:response})
 })
}

module.exports={
    addUpdateSetting,
    getSettings
}