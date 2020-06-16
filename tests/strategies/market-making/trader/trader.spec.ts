import 'mocha'
import { expect } from 'chai'
import MockHttpClient from './mock-http-client'
import RiskManager from '../../../../src/lib/risk-manager'
import MockAccountMonitor from './mock-account-monitor'
import MockLocalOrderBook from './mock-local-order-book'
import Trader from '../../../../src/lib/strategies/market-making/trader'
import { sleep } from '../../../helpers/utils'

describe('MarketMaker Trader', () => {
  const timeout = 100
  const httpClient = new MockHttpClient()
  const riskManager = new RiskManager(httpClient)
  const accountMonitor = new MockAccountMonitor()
  const orderBook = new MockLocalOrderBook()
  const testTrader = new Trader(
    orderBook,
    httpClient,
    riskManager,
    accountMonitor,
    ['VET', 'USDT']
  )

  it('should place an order when bid is called', async () => {
    testTrader.bid()

    await sleep(timeout)

    expect(httpClient.orderRequests[0]).to.eql({
      url: '/api/v3/order/test',
      method: 'POST',
      params: {
        side: 'BUY',
        price: 0.011,
        quantity: 909,
        symbol: 'VETUSDT',
        type: 'LIMIT',
        timeInForce: 'GTC'
      }
    })
    expect(testTrader['openOrders'][0]).to.eql({ i: 1, X: 'NEW' })
  })

  it('should place a sell order when an open buy order is filled', async () => {
    testTrader.update({
      e: 'executionReport',
      E: 1592057073941,
      s: 'BTCUSD',
      c: 'web_b574a462730f409fb6b462e2180e55d0',
      S: 'BUY',
      o: 'LIMIT',
      f: 'GTC',
      q: '0.00116800',
      p: '9416.1200',
      P: '0.0000',
      F: '0.00000000',
      g: -1,
      C: null,
      x: 'FILLED',
      X: 'FILLED',
      r: 'NONE',
      i: 1,
      l: '0.00000000',
      z: '0.00000000',
      L: '0.0000',
      n: '0',
      N: null,
      T: 1592057073940,
      t: -1,
      I: 146137176,
      w: true,
      m: false,
      M: false,
      O: 1592057073940,
      Z: '0.0000',
      Y: '0.0000'
    })

    await sleep(timeout)

    expect(httpClient.orderRequests[1]).to.eql({
      url: '/api/v3/order/test',
      method: 'POST',
      params: {
        side: 'SELL',
        price: 0.012,
        quantity: 100,
        symbol: 'VETUSDT',
        type: 'LIMIT',
        timeInForce: 'GTC'
      }
    })
    expect(testTrader['openOrders'][0]).to.eql({ i: 2, X: 'NEW' })
  })
})