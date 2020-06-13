import { IHttpClient, IWebSocketClient } from '../data/interfaces'

export default class OrderMonitor {
  private httpClient: IHttpClient
  private socketFN: (listenKey: string) => IWebSocketClient
  private socket!: IWebSocketClient 
  private listenKey!: string

  constructor(http: IHttpClient, wsFn: (listenKey: string) => IWebSocketClient) {
    this.httpClient = http
    this.socketFN = wsFn
    this.getListenKey()
    setTimeout(() => this.renewListenKey.bind(this), 1800000)
  }

  private async getListenKey() {
    const { data } = await this.httpClient.keyRequest({
      url: '/api/v3/userDataStream',
      method: 'POST'
    })
    const listenKey = data.listenKey
    this.socket = this.socketFN(listenKey)
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
}