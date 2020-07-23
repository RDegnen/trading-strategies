import 'mocha'
import { expect } from 'chai'
import MockHttpClient from './mock-http-client'
import RiskManager from '../../../../src/lib/risk-manager'
import MockAccountMonitor from './mock-account-monitor'
import MockLocalOrderBook from './mock-local-order-book'
import Trader from '../../../../src/lib/strategies/market-making/trader'
import { sleep } from '../../../helpers/utils'
import pino from 'pino'
import { BinanceSymbol } from '../../../../src/lib/binance-types'
import symbolInfoObject from './symbol-info'
import OpenOrderManager from '../../../../src/lib/strategies/market-making/trader/open-order-manager'

describe('MarketMaker Trader', () => {
  const timeout = 100
  const httpClient = new MockHttpClient()
  const symoblInfo: BinanceSymbol[] = [symbolInfoObject]
  const riskManager = new RiskManager(httpClient)
  const accountMonitor = new MockAccountMonitor()
  const orderBook = new MockLocalOrderBook()
  const openOrderManager = new OpenOrderManager()
  const testTrader = new Trader(
    pino({ level: 'silent' }),
    orderBook,
    httpClient,
    riskManager,
    accountMonitor,
    symoblInfo,
    ['VET', 'USDT'],
    .2,
    openOrderManager
  )

  it('should place an order when bid is called', async () => {
    testTrader.bid(1)

    await sleep(timeout)

    expect(httpClient.orderRequests[0]).to.eql({
      url: 'test',
      method: 'POST',
      params: {
        side: 'BUY',
        price: '0.00101000',
        quantity: 19802,
        symbol: 'VETUSDT',
        type: 'LIMIT',
        timeInForce: 'GTC'
      }
    })
    expect(openOrderManager.openOrders[0]).to.eql({ i: 1, side: 'BUY', price: '0.00101000', quantity: 19802 })
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
      url: 'test',
      method: 'POST',
      params: {
        side: 'SELL',
        price: '0.00100900',
        quantity: 100,
        symbol: 'VETUSDT',
        type: 'LIMIT',
        timeInForce: 'GTC'
      }
    })
    expect(openOrderManager.openOrders[0]).to.eql({ i: 2, side: 'SELL', price: '0.00100900', quantity: 100 })
  })

  it('should remove an order from open orders when canceled', () => {
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
      i: 2,
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
    expect(openOrderManager.openOrders.length).to.equal(0)
  })

  it('should place an order when ask is called', async () => {
    testTrader.ask(1)

    await sleep(timeout)

    expect(httpClient.orderRequests[1]).to.eql({
      url: 'test',
      method: 'POST',
      params: {
        side: 'SELL',
        price: '0.00100900',
        quantity: 100,
        symbol: 'VETUSDT',
        type: 'LIMIT',
        timeInForce: 'GTC'
      }
    })
    expect(openOrderManager.openOrders[0]).to.eql({ i: 3, side: 'SELL', price: '0.00100900', quantity: 100 })
  })

  it('should place a buy order when an open sell order is filled', async () => {
    testTrader.update({
      e: 'executionReport',
      E: 1592057073941,
      s: 'BTCUSD',
      c: 'web_b574a462730f409fb6b462e2180e55d0',
      S: 'SELL',
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
      i: 3,
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

    expect(httpClient.orderRequests[0]).to.eql({
      url: 'test',
      method: 'POST',
      params: {
        side: 'BUY',
        price: '0.00101000',
        quantity: 19802,
        symbol: 'VETUSDT',
        type: 'LIMIT',
        timeInForce: 'GTC'
      }
    })

    expect(openOrderManager.openOrders[0]).to.eql({ i: 4, side: 'SELL', price: '0.00100900', quantity: 100 })
  })
})