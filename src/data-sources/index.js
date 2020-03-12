const parseCsv = require('./csv')
const cryptoCompareRequest = require('./crypto-compare')

module.exports = {
  csv: parseCsv,
  cryptoCompare: cryptoCompareRequest
}