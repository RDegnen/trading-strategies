const { ema, macd } = require('technicalindicators')
const db = require('../db')
const { compose, map, zipWith } = require('ramda')

function mapperFn({ time, close }) {
  return {
    y: close,
    x: new Date(time)
  }
}

function getData(data) {
  return data.Data.Data
}

function isFloat(n) {
  return n === +n && n !== (n|0);
}

function zipper(x,y) {
  return {
    x,
    y: isFloat(y) ? y.toFixed(2) : y['MACD'].toFixed(2)
  }
}

function ti(windows) {
  const short = windows[0]
  const long = windows[windows.length - 1]
  const priceData = JSON.parse(db.read('db.json'))
  const parsedData = {
    prices: compose(
      map(mapperFn),
      getData
    )(priceData)
  }

  const values = parsedData.prices.map(({ y }) => y)
  const dates = parsedData.prices.map(({ x }) => x)
  windows.forEach(window => {
    const data = ema({ period: window, values })
    parsedData[`${window} period EMA`] = zipWith(zipper, dates, data)
  })
  db.write('ti-ema-data.json', parsedData)

  const macdata = macd({
    values,
    fastPeriod: short,
    slowPeriod: long,
    signalLine: 9,
    SimpleMAOscillator: false,
    SimpleMASignal    : false
  })

  db.write('ti-macd.json', zipWith(zipper, dates, macdata))
}

module.exports = ti