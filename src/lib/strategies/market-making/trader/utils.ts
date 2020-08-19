import { SymbolPriceFilter, SymbolLotSizeFilter } from "../../../types/binance-types"

const calculateOrderPrice = (
  currentPrice: string,
  priceFilter: SymbolPriceFilter,
  adjustedPriceFn: (tmp: number) => number
): string => {
  const tickSize = parseFloat(priceFilter.tickSize)
  const temp = (parseFloat(currentPrice) / tickSize).toFixed(0)
  return (adjustedPriceFn(parseInt(temp)) * tickSize).toFixed(8)
}

/**
 * In the future perhaps implement these rules
 * quantity >= minQty
 * quantity <= maxQty
 * (quantity-minQty) % stepSize == 0
 */
const filterOrderQuantity = (
  lotSize: SymbolLotSizeFilter,
  quantity: number
): number => {
  return Math.floor(quantity)
}

export {
  calculateOrderPrice,
  filterOrderQuantity
}