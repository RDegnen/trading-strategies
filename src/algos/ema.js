/**
 * Calculate the Exponential Moving Average
 * @param {number} weightedMultiplier Multiplier to calculate ema with
 * @param {object[]} list list of Simple Moving Averages
 */
function calculateEma(weightedMultiplier, list) {
  let previousEma = list[0].y
  return list.map(({x, y}, idx) => {
    if (idx > 0) {
      const ema = y * weightedMultiplier + previousEma * (1 - weightedMultiplier)
      previousEma = ema
      return { y: parseFloat(ema.toFixed(2)), x }
    } else {
      return { y: parseFloat(y.toFixed(2)), x }
    }
  })
}

module.exports = calculateEma