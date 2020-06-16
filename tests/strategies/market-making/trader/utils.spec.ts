import 'mocha'
import { expect } from 'chai'
import { 
  calculateOrderPrice 
} from '../../../../src/lib/strategies/market-making/trader/utils'

describe('MarketMaker Trader utils', () => {
  it('should calculate an order price', () => {
    const bidFn = (cp: number, md: number, pm: number) => cp * md + pm
    const askFn = (cp: number, md: number, pm: number) => cp * md - pm

    expect(calculateOrderPrice('0.007762', 1, bidFn)).to.equal(0.007763)
    expect(calculateOrderPrice('0.007762', 8, bidFn)).to.equal(0.00777)
    expect(calculateOrderPrice('0.00000002', 1, bidFn)).to.equal(0.00000003)
    expect(calculateOrderPrice('0.1', 1, bidFn)).to.equal(0.2)
    expect(calculateOrderPrice('0.5', 5, bidFn)).to.equal(1.0)

    expect(calculateOrderPrice('0.007762', 1, askFn)).to.equal(0.007761)
    expect(calculateOrderPrice('0.007762', 8, askFn)).to.equal(0.007754)
    expect(calculateOrderPrice('0.00000005', 1, askFn)).to.equal(0.00000004)
    expect(calculateOrderPrice('0.2', 1, askFn)).to.equal(0.1)
    expect(calculateOrderPrice('0.10', 1, askFn)).to.equal(0.09)
  })
})