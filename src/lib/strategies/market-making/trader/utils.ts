import { SymbolPriceFilter, SymbolLotSizeFilter } from "../../../binance-types"

function calculateOrderPrice(
  currentPrice: string,
  priceFilter: SymbolPriceFilter,
  adjustedPriceFn: (tmp: number) => number
): string {
  const tickSize = parseFloat(priceFilter.tickSize)
  const temp = (parseFloat(currentPrice) / tickSize).toFixed(0)
  return (adjustedPriceFn(parseInt(temp)) * tickSize).toFixed(8)
}
// FIXME. SOMEONE FILLED AN ORDER WOO, but got a Filter failure: LOT_SIZE error when trying to sell
// use lot size filter and follow these rules 

// quantity >= minQty
// quantity <= maxQty
// (quantity-minQty) % stepSize == 0

function calculateOrderQuantity(
  lotSize: SymbolLotSizeFilter,
  quantity: string
): string {
  return 'temp'
}

export {
  calculateOrderPrice,
  calculateOrderQuantity
}