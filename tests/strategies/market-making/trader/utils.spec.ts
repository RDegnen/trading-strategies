import 'mocha'
import { expect } from 'chai'
import { 
  calculateOrderPrice,
  filterOrderQuantity
} from '../../../../src/lib/strategies/market-making/trader/utils'
import { SymbolPriceFilter, SymbolLotSizeFilter } from '../../../../src/lib/types/binance-types'

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

    expect(calculateOrderPrice('0.00993300', priceFilter, bidFn(1))).to.equal('0.00993400')
    expect(calculateOrderPrice('0.00993300', priceFilter, bidFn(7))).to.equal('0.00994000')

    expect(calculateOrderPrice('0.00993300', priceFilter, askFn(1))).to.equal('0.00993200')
    expect(calculateOrderPrice('0.00993300', priceFilter, askFn(4))).to.equal('0.00992900')
  })

  it('should calculate an order price with a ticksize of 0.00000001', () => {
    const priceFilter: SymbolPriceFilter = {
      filterType: 'PRICE_FILTER',
      minPrice: '0.00000001',
      maxPrice: '1000.00000000',
      tickSize: '0.00000001'
    }

    expect(calculateOrderPrice('0.00000001', priceFilter, bidFn(1))).to.equal('0.00000002')
    expect(calculateOrderPrice('0.00000001', priceFilter, bidFn(9))).to.equal('0.00000010')

    expect(calculateOrderPrice('0.00000002', priceFilter, askFn(1))).to.equal('0.00000001')
    expect(calculateOrderPrice('0.00000010', priceFilter, askFn(1))).to.equal('0.00000009')
  })

  it('should filter an order quantity', () => {
    const lotSizeFilter: SymbolLotSizeFilter = {
      filterType: 'LOT_SIZE',
      minQty: '1.00000000',
      maxQty: '90000000.00000000',
      stepSize: '1.00000000'
    }
    expect(filterOrderQuantity(lotSizeFilter, 1200.6)).to.equal(1200)
  })
})