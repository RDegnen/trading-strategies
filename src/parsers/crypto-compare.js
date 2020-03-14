const db = require('../db')
const { compose, curry, map } = require('ramda')
const { sma, ema } = require('../algos')

function mapperFn({ time, close }) {
  return {
    y: close,
    x: new Date(time)
  }
}

function getData(data) {
  return data.Data.Data
}

function parseCyptoCompare() {
  const windows = [3, 5, 8]
  const priceData = JSON.parse(db.read('db.json'))
  const parsedData = {
    prices: compose(
      map(mapperFn),
      getData
    )(priceData)
  }

  windows.forEach(window => {
    const data = compose(
      curry(ema)(2 / (window + 1)),
      curry(sma)(window),
      map(mapperFn),
      getData
    )(priceData)
    parsedData[`${window} period EMA`] = data
  })
  
  db.write('ema-data.json', parsedData)
}

module.exports = parseCyptoCompare