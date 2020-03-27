const calculateSma = require('./sma')
const calculateEma = require('./ema')
const macd = require('./macd')

module.exports = {
  sma: calculateSma,
  ema: calculateEma,
  macd
}