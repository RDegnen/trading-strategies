import { SymbolPriceFilter } from "../../../binance-types"

function calculateOrderPrice(
  currentPrice: string,
  priceFilter: SymbolPriceFilter,
  adjustedPriceFn: (tmp: number) => number
): string {
  const tickSize = parseFloat(priceFilter.tickSize)
  const temp = (parseFloat(currentPrice) / tickSize).toFixed(0)
  return (adjustedPriceFn(parseInt(temp)) * tickSize).toFixed(8)
}

export {
  calculateOrderPrice
}