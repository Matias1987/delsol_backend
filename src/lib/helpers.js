const parse_date_for_mysql = (some_date) => {
    console.log("param: "+some_date)

    const parts = some_date.split('-')
    console.log(parts[2])
    console.log(parts[1])
    console.log(parts[0])
    console.log(new Date(parts[2],(parts[1])-1,parts[0]).toString())
    return new Date(parts[2],(parts[1])-1,parts[0]).toISOString().slice(0, 19).replace('T', ' ')
}

const get_uid = (userid) => {
    return userid + Date.now().toString(36) + Math.random().toString(36)
}

module.exports = {
    parse_date_for_mysql,
    get_uid
}