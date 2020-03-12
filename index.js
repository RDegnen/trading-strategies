require('dotenv').config()
const dataSources = require('./src/data-sources')

function main() {
  switch (process.argv[2]) {
    case 'csv':
      dataSources
        .csv('./data/BTC_USD_2019-03-05_2020-03-04-CoinDesk.csv')
      break
    case 'crypto':
      dataSources.cryptoCompare()
      break
    default:
      break
  }
}

main()
