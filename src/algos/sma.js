/**
 * Calculates the Simple Moving Average
 * @param {*} smaWindow Lenght of time to group averages by
 * @param {object[]} list List of price objects
 */
function calculateSma(smaWindow, list) {
  const smaList = []

  for(let i = 0; i < list.length; i++) {
    const j = i + smaWindow
    const avg = list.slice(i, j)
      .reduce((acc, curr) => acc + curr.y, 0)
      / smaWindow
    smaList.push({ x: list[i].x, y: avg })
  }

  return smaList
}

module.exports = calculateSma