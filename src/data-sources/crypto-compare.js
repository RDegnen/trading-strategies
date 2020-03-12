const https = require('https')
const { CRYPTO_COMPARE_HOSTNAME } = require('./constants')

function cryptoCompareRequest() {
  const req = https.request({
    hostname: CRYPTO_COMPARE_HOSTNAME,
    path: '/data/v2/histominute?fsym=ETH&tsym=GBP&limit=10',
    method: 'GET',
    headers: {
      Authorization: `Basic ${[process.env.CRYPTO_COMPARE_PRICES_KEY]}`
    }
  }, res => {
    res.on('data', data => console.log(JSON.parse(data)))
  })

  req.on('error', err => console.error(err))
  req.end()
}

module.exports = cryptoCompareRequest