import 'mocha'
import { expect } from 'chai'
import { IHttpClient, IWebSocketClient } from '../../src/lib/data/interfaces'
import MockHttpClient from './mock-http-client'
import MockWebSocketClient from './mock-websocket-client'
import LocalOrderBook from '../../src/lib/local-order-book'
import { EventEmitter } from 'events'
import { sleep } from '../helpers/utils'

describe('LocalOrderBook', () => {
  const timeout = 100
  const emitter = new EventEmitter()
  const webSocketClient: IWebSocketClient = new MockWebSocketClient(emitter)
  const httpClient: IHttpClient = new MockHttpClient()
  const testOrderBook = new LocalOrderBook(
    webSocketClient,
    httpClient,
    'SYMBOL'
  )

  it('should create the book', async () => {
    emitter.emit(
      'data',
      [
        JSON.stringify({
          e: 'depthUpdate',
          E: 1,
          s: 'SYMBOL',
          U: 10,
          u: 12,
          b: [],
          a: []
        })
      ]
    )

    await sleep(timeout)

    expect(testOrderBook.book).to.not.equal(undefined)
    expect(testOrderBook.book.lastUpdateId).to.equal(12)
  })

  it('should update the highest bid', async () => {
    emitter.emit(
      'data',
      [
        JSON.stringify({
          e: 'depthUpdate',
          E: 2,
          s: 'SYMBOL',
          U: 13,
          u: 14,
          b: [['10.1', '12345']],
          a: []
        })
      ]
    )

    await sleep(timeout)
    const [price, quantity] = testOrderBook.book.sides['bids'][0]

    expect(price).to.equal('10.1')
    expect(quantity).to.equal('12345')
  })

  it('should update the lowest ask', async () => {
    emitter.emit(
      'data',
      [
        JSON.stringify({
          e: 'depthUpdate',
          E: 3,
          s: 'SYMBOL',
          U: 15,
          u: 16,
          b: [],
          a: [['10.9', '1000']]
        })
      ]
    )

    await sleep(timeout)
    const [price, quantity] = testOrderBook.book.sides['asks'][0]

    expect(price).to.equal('10.9')
    expect(quantity).to.equal('1000')
  })

  it('should remove updated prices with a quantity of 0', async () => {
    emitter.emit(
      'data',
      [
        JSON.stringify({
          e: 'depthUpdate',
          E: 3,
          s: 'SYMBOL',
          U: 17,
          u: 18,
          b: [['10.1', '0']],
          a: [['10.9', '0']]
        })
      ]
    )

    await sleep(timeout)
    const [askPrice] = testOrderBook.book.sides['asks'][0]
    const [bidPrice] = testOrderBook.book.sides['bids'][0]

    expect(askPrice).to.equal('11')
    expect(bidPrice).to.equal('10')
  })

  it("should update an existing price's quantity", async () => {
    emitter.emit(
      'data',
      [
        JSON.stringify({
          e: 'depthUpdate',
          E: 3,
          s: 'SYMBOL',
          U: 19,
          u: 20,
          b: [['10', '100']],
          a: [['11', '100']]
        })
      ]
    )

    await sleep(timeout)
    const [askPrice, askQuantity] = testOrderBook.book.sides['asks'][0]
    const [bidPrice, bidQuantity] = testOrderBook.book.sides['bids'][0]

    expect(askQuantity).to.equal('100')
    expect(bidQuantity).to.equal('100')
  })
})