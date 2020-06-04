import { IWebSocketClient } from '../../src/lib/data/interfaces'
import { EventEmitter } from 'events'

export default class MockWebSocketClient implements IWebSocketClient {
  private client: EventEmitter

  constructor (client: EventEmitter) {
    this.client = client

    client.on('message', this.onMessage.bind(this))
  }

  onMessage(cb: (data: any) => any) {
    this.client.on('data', data => {
      cb(data)
    })
  }
}