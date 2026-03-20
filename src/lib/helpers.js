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

function getFormattedDateLocal() {
  const date = new Date();
  const year = date.getFullYear();
  // getMonth() is 0-indexed (January is 0), so add 1
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getSubstring(a, start, length) {
  // Clean up whitespace first
  let trimmed = a.trim();

  // Ensure start is within bounds
  if (start < 0) start = 0;
  if (start >= trimmed.length) return "";

  // Extract the substring
  return trimmed.substring(start, start + length);
}

module.exports = {
    parse_date_for_mysql,
    get_uid,
    getFormattedDateLocal,
    getSubstring,
}