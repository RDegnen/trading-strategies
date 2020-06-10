function calculateOrderPrice(
  currentPrice: string, 
  priceMove: number,
  adjustedPriceFn: (cp: number, md: number, pm: number) => number
): number {
  const decimalList = parseFloat(currentPrice)
    .toFixed(decimalLength(currentPrice))
    .toString()
    .split('')
    .filter(val => val != '.')

  let stringBuilder = '1'
  for (let i = 0; i < decimalList.length; i++) {
    if (i > 0) {
      stringBuilder += '0'
    }
  }

  const multiplierDivisor = parseInt(stringBuilder)
  const adjustedPriceInt = adjustedPriceFn(parseFloat(currentPrice), multiplierDivisor, priceMove)

  return adjustedPriceInt / multiplierDivisor
}

function decimalLength(decimalString: string): number {
  return decimalString.split('.')[1].length
}

export {
  calculateOrderPrice
}