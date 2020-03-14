const https = require('https')
const { CRYPTO_COMPARE_HOSTNAME } = require('./constants')
const db = require('../db')
const { compose, curry } = require('ramda')

function cryptoCompareRequest() {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: CRYPTO_COMPARE_HOSTNAME,
      path: '/data/v2/histominute?fsym=ETH&tsym=USD&limit=1440',
      method: 'GET',
      headers: {
        Authorization: `Basic ${[process.env.CRYPTO_COMPARE_PRICES_KEY]}`
      }
    }, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(data))
    })
  
    req.on('error', err => reject(err))
    req.end()
  })
}

async function cryptoCompare() {
  compose(
    curry(db.write)('db.json'),
    JSON.parse
  )(await cryptoCompareRequest())
}

module.exports = cryptoCompare