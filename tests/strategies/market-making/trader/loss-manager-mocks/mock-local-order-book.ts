import { bookType } from '../types'
import Book from "../../../../../src/lib/local-order-book/book"
import { IWebSocketClient } from '../../../../../src/lib/data-sources/interfaces'
import { IObserver, IBookUpdateEvent } from '../../../../../src/lib/types/types'
import { DiffDepthStream } from '../../../../../src/lib/types/binance-types'

export default class MockLocalOrderBook implements bookType {
  book: Book
  private socket: IWebSocketClient
  private observers: IObserver<IBookUpdateEvent>[]

  constructor(ws: IWebSocketClient) {
    this.socket = ws
    this.observers = []
    this.socket.onMessage(this.onMessage.bind(this))
    
    this.book = new Book(
      1,
      [
        ['0.10', '10000.00000000']
      ],
      [
        ['0.20', '10000.00000000']
      ]
    )
  }

  attach(o: IObserver<IBookUpdateEvent>, eventType: string) {
    this.observers.push(o)
  }

  notifyObservers(event: IBookUpdateEvent) {
    this.observers.forEach(o => {
      o.update(event)
    })
  }

  private createBook() {
    this.book = new Book(
      1,
      [
        ['0.10', '10000.00000000']
      ],
      [
        ['0.20', '10000.00000000']
      ]
    )
  }

  private onMessage(incomingData: string) {
    const data: DiffDepthStream = JSON.parse(incomingData)

    this.processUpdates(data)
    this.notifyObservers({ e: 'Book Update' })
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