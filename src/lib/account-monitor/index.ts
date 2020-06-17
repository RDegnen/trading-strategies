import { IHttpClient, IWebSocketClient } from '../data/interfaces'
import {
  IAccountSubject,
  IAccountObserver,
  IAccountUpdateEvent, 
  AccountEventTypes 
} from '../types'

export default class AccountMonitor implements IAccountSubject {
  private httpClient: IHttpClient
  private socket: IWebSocketClient 
  private listenKey!: string
  private orderObservers: IAccountObserver[]
  private accountObservers: IAccountObserver[]

  constructor(http: IHttpClient, ws: IWebSocketClient) {
    this.httpClient = http
    this.socket = ws
    this.orderObservers = []
    this.accountObservers = []
    this.getListenKey()
    setInterval(this.renewListenKey.bind(this), 1800000)
  }

  attach(o: IAccountObserver, eventType: string) {
    if (eventType === AccountEventTypes.ORDER) {
      this.orderObservers.push(o)
    } else if (eventType === AccountEventTypes.ACCOUNT) {
      this.accountObservers.push(o)
    }
  }

  notifyObservers(event: IAccountUpdateEvent) {
    if (event.e === 'executionReport') {
      this.orderObservers.forEach(observer => {
        observer.update(event)
      })
    } else if (event.e === 'outboundAccountInfo' || event.e === 'outboundAccountPosition') {
      this.accountObservers.forEach(observer => {
        observer.update(event)
      })
    }
  }

  private async getListenKey() {
    const { data } = await this.httpClient.keyRequest({
      url: '/api/v3/userDataStream',
      method: 'POST'
    })
    const listenKey = data.listenKey
    this.socket.openSocket(`wss://stream.binance.us:9443/ws/${listenKey}`)
    this.socket.onMessage(this.onMessage.bind(this))
    this.listenKey = listenKey
  }

  private renewListenKey() {
    this.httpClient.keyRequest({
      url: '/api/v3/userDataStream',
      method: 'PUT',
      params: {
        listenKey: this.listenKey
      }
    })
  }

  private onMessage(incomingData: string) {
    const data: IAccountUpdateEvent = JSON.parse(incomingData)
    console.log(data)
    this.notifyObservers(data)
  }
}