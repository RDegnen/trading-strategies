import { IWebSocketClient, IHttpClient } from "../../data/interfaces"
import { DiffDepthStream } from '../../binance-types'

interface IOrderBook {
  lastUpdateId: number,
  bids: string[][],
  asks: string[][],
}

class Book implements IOrderBook {
  lastUpdateId: number
  bids: string[][]
  asks: string[][]

  constructor(
    lastUpdateId: number,
    bids: string[][],
    asks: string[][]
  ) {
    this.lastUpdateId = lastUpdateId
    this.bids = bids
    this.asks = asks
  }

  getSide(side: string): string[][] {
    if (side === 'bids') {
      return this.bids
    } else if (side === 'asks') {
      return this.asks
    }
    return []
  }

  removePrice(side: string, idx: number) {
    if (side === 'bids') {
      this.bids.splice(idx, 1)
    } else if (side === 'asks') {
      this.asks.splice(idx, 1)
    }
  }

  updateSide(side: string, idx: number, removeOrUpdate: number, update: string[]) {
    if (side === 'bids') {
      this.bids.splice(idx, removeOrUpdate, update)
    } else if (side === 'asks') {
      this.asks.splice(idx, removeOrUpdate, update)
    }
  }
}

export default class OrderBook {
  private socket: IWebSocketClient
  private httpClient: IHttpClient
  private symbol: string
  private updates: number = 0
  book!: Book

  constructor(
    ws: IWebSocketClient,
    http: IHttpClient,
    sym: string
  ) {
    this.socket = ws
    this.httpClient = http
    this.symbol = sym

    this.socket.onMessage(this.onMessage.bind(this))
  }

  async onMessage(incomingData: string) {
    const data: DiffDepthStream = JSON.parse(incomingData)
    if (!this.book) {
      const { lastUpdateId, bids, asks } = await this.getSnapshot()
      this.book = new Book(lastUpdateId, bids, asks)
    }
    console.log(this.book.asks[0], this.book.bids[0])
    const { lastUpdateId } = this.book

    if (!this.updates) {
      if ((data.U <= lastUpdateId + 1) && (data.u >= lastUpdateId + 1)) {
        this.processUpdates(data)
        this.book.lastUpdateId = data.u
      } else {
        console.log('discard')
      }
    } else if (data.U === lastUpdateId + 1) {
      this.processUpdates(data)
      this.book.lastUpdateId = data.u
    } else {
      console.log('out of sync')
    }

  }

  async getSnapshot(): Promise<IOrderBook> {
    return (await this.httpClient.request({
      url: '/api/v3/depth',
      params: {
        symbol: this.symbol,
        limit: 1000
      }
    })).data
  }

  processUpdates(data: DiffDepthStream) {
    data.b.forEach(bid => {
      this.manageBook('bids', bid)
    })
    data.a.forEach(ask => {
      this.manageBook('asks', ask)
    })
  }

  manageBook(side: string, update: string[]) {
    const [price, quantity] = update
    const sideList = this.book.getSide(side)

    for (let i = 0; i < sideList.length; i++) {
      const value = sideList[i]
      if (price === value[0]) {
        if (parseFloat(quantity) === 0) {
          this.book.removePrice(side, i)
          break
        } else {
          this.book.updateSide(side, i, 1, update)
          break
        }
      } else if (price > value[0]) {
        if (parseFloat(quantity) !== 0) {
          this.book.updateSide(side, i, 0, update)
          break
        } else {
          break
        }
      }
    }
  }
}