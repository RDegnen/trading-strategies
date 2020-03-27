require('dotenv').config()
const dataSources = require('./src/data-sources')
const parsers = require('./src/parsers')

async function main() {
  switch (process.argv[2]) {
    case 'csv':
      dataSources
        .csv('./data/BTC_USD_2019-03-05_2020-03-04-CoinDesk.csv')
      break
    case 'crypto':
      if (process.argv[3] === 'write') {
        await dataSources.cryptoCompare()
      } else if (process.argv[3] === 'read') {
        const windows = [13,34,89]
        parsers.cryptoCompare(windows)
        parsers.technicalIndicators(windows)
      }
      break
    default:
      break
  }
}

main()
