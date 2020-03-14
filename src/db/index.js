const { writeFile, readFileSync } = require('fs')

const DB_PATH = `${__dirname}/../../data`

function write(file, data) {
  writeFile(`${DB_PATH}/${file}`, JSON.stringify(data), err => {
    if (err) console.error(err)
  })
}

function read(file) {
  return readFileSync(`${DB_PATH}/${file}`)
}

module.exports = {
  write,
  read
}