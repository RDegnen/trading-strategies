import { IWebSocketClient, IHttpClient } from "../data/interfaces"
import Book, { IOrderBook } from "./book"
import { DiffDepthStream } from "../binance-types"

export default class LocalOrderBook {
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
    //console.log('asks', this.book.asks[0], 'bids', this.book.bids[0])
    const { lastUpdateId } = this.book

    if (!this.updates) {
      if ((data.U <= lastUpdateId + 1) && (data.u >= lastUpdateId + 1)) {
        this.processUpdates(data)
        this.book.lastUpdateId = data.u
        this.updates += 1
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
      this.manageBids('bids', bid)
    })
    data.a.forEach(ask => {
      this.manageAsks('asks', ask)
    })
  }

  // FIXME something is fishy, try testing ask updates with [ [ '0.00762900', '306229.00000000' ] ] 
  // vs [ '0.00772200', '13093.00000000' ] where the former should be the first one in the asks column
  // AFTER more obeservation, the asks column looks like its updating wrong. higher values are taking 
  // precedence over lower values which is fine for the bids, but not the asks.
  manageBids(side: string, update: string[]) {
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

  manageAsks(side: string, update: string[]) {
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
      } else if (price < value[0]) {
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