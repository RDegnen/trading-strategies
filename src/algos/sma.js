/**
 * Calculates the Simple Moving Average
 * @param {*} smaWindow Lenght of time to group averages by
 * @param {object[]} list List of price objects
 */
function calculateSma(smaWindow, list) {
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