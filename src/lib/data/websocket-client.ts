import WS from 'ws'

export default class WebSocketClient {
  private client: WS
  private pingTimeout!: NodeJS.Timeout

  constructor(url: string) {
    this.client = new WS(url)

    this.client.on('open', this.heartbeat.bind(this))
    this.client.on('ping', this.heartbeat.bind(this))
    this.client.on('close', () => {
      clearTimeout(this.pingTimeout)
    })
  }

  onMessage(cb: (data: WS.Data) => any) {
    this.client.on('message', data => {
      cb(data)
    })
  }

  private heartbeat() {
    clearTimeout(this.pingTimeout)

    this.pingTimeout = setTimeout(() => {
      this.client.terminate()
    }, 240000)
  }
}