import { IWebSocketClient, IHttpClient } from "../data-sources/interfaces"
import Book from "./book"
import { DiffDepthStream } from "../types/binance-types"
import { ISubject, IBookUpdateEvent, IObserver } from "../types/types"

interface IOrderBook {
  lastUpdateId: number,
  bids: string[][],
  asks: string[][],
}

export interface ILocalOrderBook {
  book: Book
}

export default class LocalOrderBook 
  implements ILocalOrderBook, ISubject<IObserver<IBookUpdateEvent>, IBookUpdateEvent> {
    book!: Book
    private updates: number = 0
    private observers: IObserver<IBookUpdateEvent>[] = []

    constructor(
      private socket: IWebSocketClient,
      private httpClient: IHttpClient,
      private symbol: string
    ) {
      this.socket = socket
      this.httpClient = httpClient
      this.symbol = symbol

      this.socket.openSocket(`wss://stream.binance.us:9443/ws/${symbol.toLocaleLowerCase()}@depth`)
      this.socket.onMessage(this.onMessage.bind(this))
      this.createBook()
    }

    attach(o: IObserver<IBookUpdateEvent>, eventType: string) {
      this.observers.push(o)
    }

    notifyObservers(event: IBookUpdateEvent) {
      this.observers.forEach(o => {
        o.update(event)
      })
    }

    private async createBook() {
      const { lastUpdateId, bids, asks } = await this.getSnapshot()
      this.book = new Book(lastUpdateId, bids, asks)
    }

    private async onMessage(incomingData: string) {
      const data: DiffDepthStream = JSON.parse(incomingData)

      if (!this.book) {
        await this.createBook()
      }

      const { lastUpdateId } = this.book

      if (!this.updates) {
        if ((data.U <= lastUpdateId + 1) && (data.u >= lastUpdateId + 1)) {
          this.processUpdates(data)
          this.book.lastUpdateId = data.u
          this.updates += 1
        }
      } else if (data.U === lastUpdateId + 1) {
        this.processUpdates(data)
        this.book.lastUpdateId = data.u
      } else {
        console.log('out of sync')
      }
      this.notifyObservers({ e: 'Book Update' })
    }

    private async getSnapshot(): Promise<IOrderBook> {
      return (await this.httpClient.request({
        url: '/api/v3/depth',
        params: {
          symbol: this.symbol,
          limit: 1000
        }
      })).data
    }

    private processUpdates(data: DiffDepthStream) {
      data.b.forEach(bid => {
        this.manageBook('bids', bid)
      })
      data.a.forEach(ask => {
        this.manageBook('asks', ask)
      })
    }

    private manageBook(side: string, update: string[]) {
      const [price, quantity] = update
      const sideList = this.book.sides[side]

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
        } else if (this.priceComparator(side, price, value[0])) {
          if (parseFloat(quantity) !== 0) {
            this.book.updateSide(side, i, 0, update)
            break
          } else {
            break
          }
        }
      }
    }

    private priceComparator(
      side: string,
      updatedPrice: string,
      currentPrice: string
    ): boolean {
      if (side === 'asks') {
        return updatedPrice < currentPrice
      } else if (side === 'bids') {
        return updatedPrice > currentPrice
      }
      return false
    }
}