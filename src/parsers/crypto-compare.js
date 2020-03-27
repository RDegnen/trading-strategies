const db = require('../db')
const { 
  compose, 
  curry, 
  map, 
  dropLast 
} = require('ramda')
const { sma, ema, macd } = require('../algos')

function mapperFn({ time, close }) {
  return {
    y: close,
    x: new Date(time)
  }
}

function getData(data) {
  return data.Data.Data
}

function appendTimeString({ x, ...rest }) {
  return {
    timeString: x.toLocaleTimeString('en-US', { hour12: false }),
    x,
    ...rest
  }
}

function parseCyptoCompare(windows) {
  const short = windows[0]
  const long = windows[windows.length - 1]
  const priceData = JSON.parse(db.read('db.json'))
  const parsedData = {
    prices: compose(
      map(mapperFn),
      getData
    )(priceData)
  }

  windows.forEach(window => {
    const data = compose(
      map(appendTimeString),
      dropLast(long),
      curry(ema)(2 / (window + 1)),
      curry(sma)(window),
      map(mapperFn),
      getData
    )(priceData)
    parsedData[`${window} period EMA`] = data
  })
  const md = macd.macd(parsedData[`${short} period EMA`], parsedData[`${long} period EMA`])

  db.write('ema-data.json', parsedData)
  db.write('macd.json', {
    macdLine: md,
    signalLine: macd.signalLine(md)
  })
}

module.exports = parseCyptoCompare