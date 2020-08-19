import 'mocha'
import { expect } from 'chai'
import MockHttpClient from './mock-http-client'
import MockLocalOrderBook from './loss-manager-mocks/mock-local-order-book'
import MockWebSocketClient from '../../../helpers/mock-websocket-client'
import LossManager from '../../../../src/lib/strategies/market-making/trader/loss-manager'
import { EventEmitter } from 'events'
import { IWebSocketClient } from '../../../../src/lib/data-sources/interfaces'
import OrderManager from '../../../../src/lib/strategies/market-making/trader/order-manager'
import { sleep } from '../../../helpers/utils'
import { OrderSide } from '../../../../src/lib/types/binance-types'

describe('MarketMaker Loss Manager', () => {
  const timeout = 100
  const emitter = new EventEmitter()
  const webSocketClient: IWebSocketClient = new MockWebSocketClient(emitter)
  const httpClient = new MockHttpClient()
  const openOrderManager = new OrderManager()
  const localOrderBook = new MockLocalOrderBook(webSocketClient)
  const _ = new LossManager(
    localOrderBook,
    openOrderManager,
    httpClient
  )

  openOrderManager.addOrder({
    i: 1,
    side: OrderSide.BUY,
    price: '0.10',
    quantity: 1000,
    status: 'OPEN'
  })

  openOrderManager.closeOrder(1)

  openOrderManager.addOrder({
    i: 2,
    side: OrderSide.SELL,
    price: '0.20',
    quantity: 1000,
    status: 'OPEN'
  })

  // it('place a new ask on price drop', () => {
  //   emitter.emit(
  //     'data',
  //     [
  //       JSON.stringify({
  //         e: 'depthUpdate',
  //         E: 2,
  //         s: 'SYMBOL',
  //         U: 13,
  //         u: 14,
  //         b: [],
  //         a: [['0.15', '10000']]
  //       })
  //     ]
  //   )

  //   sleep(timeout)

  //   emitter.emit(
  //     'data',
  //     [
  //       JSON.stringify({
  //         e: 'depthUpdate',
  //         E: 2,
  //         s: 'SYMBOL',
  //         U: 15,
  //         u: 16,
  //         b: [],
  //         a: [['0.14', '10000']]
  //       })
  //     ]
  //   )

  //   sleep(timeout)

  // })
})