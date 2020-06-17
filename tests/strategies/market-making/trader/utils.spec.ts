import 'mocha'
import { expect } from 'chai'
import { 
  calculateOrderPrice 
} from '../../../../src/lib/strategies/market-making/trader/utils'
import { SymbolPriceFilter } from '../../../../src/lib/binance-types'

describe('MarketMaker Trader utils', () => {
  const bidFn = (priceMove: number) => (temp: number) => temp + priceMove
  const askFn = (priceMove: number) => (temp: number) => temp - priceMove

  it('should calculate an order price with a ticksize of 0.00000100', () => {
    const priceFilter: SymbolPriceFilter = {
      filterType: 'PRICE_FILTER',
      minPrice: '0.00000100',
      maxPrice: '1000.00000000',
      tickSize: '0.00000100'
    }

    expect(calculateOrderPrice('0.00993300', priceFilter, bidFn(1))).to.equal(0.009934)
    expect(calculateOrderPrice('0.00993300', priceFilter, bidFn(7))).to.equal(0.009940)

    expect(calculateOrderPrice('0.00993300', priceFilter, askFn(1))).to.equal(0.009932)
    expect(calculateOrderPrice('0.00993300', priceFilter, askFn(4))).to.equal(0.009929)
  })
})