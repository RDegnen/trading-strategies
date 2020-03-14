const csv = require('@fast-csv/parse')
const { createReadStream, writeFile } = require('fs')
const { sma, ema } = require('../algos')

/**
 * Parses a csv file and writes the data to another file
 * @param {string} file csv file to parse
 */
function parseCsv(file) {
  const pricesList = []

  createReadStream(file)
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
      pricesList.push({
        y: row['Closing Price (USD)'],
        x: row['Date']
      })
    })
    .on('end', () => {
      const data = {
        'Daily Prices': pricesList
      }
      const smaWindows = [3,6,12]

      smaWindows.forEach(window => {
        const weightedMultiplier = 2 / (window + 1)

        const smaList = sma(window, pricesList)
        const emaList = ema(weightedMultiplier, smaList)
        data[`${window} day EMA`] = emaList
      })

      writeFile(`${__dirname}/../../data/ema-data.json`, JSON.stringify(data, null, 2), err => {
        if (err) console.error(err)
      })
    })
}


module.exports = parseCsv