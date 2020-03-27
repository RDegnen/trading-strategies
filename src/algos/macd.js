const { curry, groupBy, invoker } = require('ramda')
const sma = require('./sma')

const byTimeString = groupBy(({ timeString }) => timeString)

const mapperFn = curry((obj, key) => {
  const val = obj[key]
  return val[val.length - 1]
})

/**
 * Calculates the Moving Average Convergence Divergence
 * of two exponential moving averages
 * @param {object[]} ema1 Exponential moving average
 * @param {object[]} ema2 Exponential moving average
 */
function macd(ema1, ema2) {
  const short = byTimeString(ema1)
  const long = byTimeString(ema2)
  const shortCloses = Object.keys(short).map(mapperFn(short))
  const longCloses = Object.keys(long).map(mapperFn(long))
  const toFixedFrom = invoker(1, 'toFixed')

  return longCloses.map((val, idx) => ({ 
    y: parseFloat(toFixedFrom(2, shortCloses[idx].y - val.y)),
    x: val.x
  }))
}

function signalLine(macd) {
  return sma(9, macd)
}

module.exports = {
  macd,
  signalLine
}