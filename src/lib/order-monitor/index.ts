import { IHttpClient, IWebSocketClient } from '../data/interfaces'

export default class AccountMonitor {
  private httpClient: IHttpClient
  private socket: IWebSocketClient 
  private listenKey!: string

  constructor(http: IHttpClient, ws: IWebSocketClient) {
    this.httpClient = http
    this.socket = ws
    this.getListenKey()
    setInterval(this.renewListenKey.bind(this), 1800000)
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
    console.log('Incoming Account Info')
    console.log(JSON.parse(incomingData))
  }
}