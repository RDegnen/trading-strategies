import { IObserver, IBookUpdateEvent, ISubject } from '../../../types'
import { ILocalOrderBook } from '../../../local-order-book'
import OpenOrderManager from './open-order-manager'
/**
 * The point of this class is to make an attempt to flat trade if 
 * the price of the current ask is going to go below where I bought
 * the currency at. If flat trading is not possible then attempt to 
 * minimize losses.
 */

type bookType = ILocalOrderBook & ISubject<IObserver<IBookUpdateEvent>, IBookUpdateEvent>

export default class LossManager implements IObserver<IBookUpdateEvent> {
  private localOrderBook: bookType
  private openOrderManager: OpenOrderManager

  constructor(book: bookType, openOrderManager: OpenOrderManager) {
    this.localOrderBook = book
    this.openOrderManager = openOrderManager

    this.localOrderBook.attach(this, '')
  }

  update() {
    // 1 check open orders for an ask order
    // 2 if an ask order is open, compare the price of the previous buy order against the book
    // 3 if it looks like the ask side of the book is dropping back towards that price, then cancel
    // the current ask, and place a new ask at the price of the previous bid order
  }
}