/**
 * Calculates the Simple Moving Average
 * @param {object[]} list List of price objects
 * @param {*} smaWindow Lenght of time to group averages by
 */
function calculateSma(list, smaWindow) {
  const smaList = []
  const smaWindowList = []

  for(let i = 0; i < list.length; i += smaWindow) {
    smaWindowList.push(list.slice(i, i + smaWindow))
  }

  smaWindowList.forEach(windowList => {
    const sma = windowList.reduce((acc, curr) => {
      return acc + parseFloat(curr.y)
    }, 0) / smaWindow
    smaList.push({ y: sma, x: windowList[0].x })
  })

  return smaList
}

module.exports = calculateSma