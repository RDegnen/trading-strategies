import 'mocha'
import { expect } from 'chai'
import AccountMonitor from '../../src/lib/account-monitor'
import { EventEmitter } from 'events'
import MockWebSocketClient from '../helpers/mock-websocket-client'
import { IWebSocketClient, IHttpClient } from '../../src/lib/data-sources/interfaces'
import MockHttpClient from './mock-http-client'
import { sleep } from '../helpers/utils'
import { TestOrderObserver, TestAccountObserver } from './observers'
import pino from 'pino'

describe('AccountMonitor', () => {
  const timeout = 100
  const emitter = new EventEmitter()
  const webSocketClient: IWebSocketClient = new MockWebSocketClient(emitter)
  const httpClient: IHttpClient = new MockHttpClient()
  const testAccountMonitor = new AccountMonitor(
    httpClient,
    webSocketClient,
    pino({ level: 'silent' })
  )

  it('notifies its order observers', async () => {
    const orderObserver = new TestOrderObserver()
    const accountObserver = new TestAccountObserver()
    testAccountMonitor.attach(orderObserver, 'Order')
    testAccountMonitor.attach(accountObserver, 'Account')

    emitter.emit(
      'data', 
      JSON.stringify({ e: 'executionReport' })
    )

    await sleep(timeout)

    expect(orderObserver.updateHasBeenCalled).to.equal(true)
    expect(accountObserver.updateHasBeenCalled).to.equal(false)
  })

  it('notifies its account observers', async () => {
    for (const event of ['outboundAccountInfo', 'outboundAccountPosition']) {
      const orderObserver = new TestOrderObserver()
      const accountObserver = new TestAccountObserver()
      testAccountMonitor.attach(orderObserver, 'Order')
      testAccountMonitor.attach(accountObserver, 'Account')

      emitter.emit(
        'data', 
        JSON.stringify({ e: event })
      )

      await sleep(timeout)

      expect(orderObserver.updateHasBeenCalled).to.equal(false)
      expect(accountObserver.updateHasBeenCalled).to.equal(true)
    }
  })
})