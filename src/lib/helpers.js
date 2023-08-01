const parse_date_for_mysql = (some_date) => {
    const parts = some_date.split('-')
    return new Date(parts[2],(parts[1])-1,parts[0]).toISOString().slice(0, 19).replace('T', ' ')
}

module.exports = {
    parse_date_for_mysql
}