import { IObserver, IBookUpdateEvent, ISubject } from '../../../types/types'
import { ILocalOrderBook } from '../../../local-order-book'
import OrderManager, { IOrder } from './order-manager'
import { IHttpClient } from '../../../data-sources/interfaces'
import { OrderSide } from '../../../types/binance-types'
import { findLast } from 'ramda'
/**
 * The point of this class is to make an attempt to flat trade if 
 * the price of the current ask is going to go below where I bought
 * the currency at. If flat trading is not possible then attempt to 
 * minimize losses.
 */

type bookType = ILocalOrderBook & ISubject<IObserver<IBookUpdateEvent>, IBookUpdateEvent>

export default class LossManager implements IObserver<IBookUpdateEvent> {
  private localOrderBook: bookType
  private openOrderManager: OrderManager
  private httpClient: IHttpClient

  constructor(
    book: bookType, 
    openOrderManager: OrderManager,
    http: IHttpClient
  ) {
    this.localOrderBook = book
    this.openOrderManager = openOrderManager
    this.httpClient = http

    this.localOrderBook.attach(this, '')
  }

  update() {
    // 1 check open orders for an ask order
    const openAsk = this.openOrderManager.orders.find(({ side }) => {
      return side === OrderSide.SELL
    })
    // 2 if an ask order is open, compare the price of the previous buy order against the book
    if (openAsk) {
      const previousBuy = findLast(
        (order: IOrder) => order.side === OrderSide.BUY
      )(this.openOrderManager.orders)
      const previousBuyPrice = previousBuy?.price
      const { asks } = this.localOrderBook.book.sides
      const askPrices = asks.map(([price, quantity]) => parseFloat(price))
      console.log(asks)
      //this.isTrendingDownward(askPrices)
    }
    // 3 if it looks like the ask side of the book is dropping back towards that price, then cancel
    // the current ask, and place a new ask at the price of the previous bid order
  }

  private isTrendingDownward(prices: number[]): boolean {
    return prices.every((price, idx) => {
      const nextIdx = idx + 1
      return nextIdx < prices.length ? price <= prices[nextIdx] : true
    })
  }
}