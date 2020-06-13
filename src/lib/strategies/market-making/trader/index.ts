import { IHttpClient } from "../../../data/interfaces"
import LocalOrderBook from '../../../local-order-book'
import { IRiskManager } from '../../../risk-manager'
import { calculateOrderPrice } from './utils'

type symbolPair = [string, string]

export default class Trader {
  localOrderBook: LocalOrderBook
  httpClient: IHttpClient
  riskManager: IRiskManager
  pair: symbolPair

  constructor(
    book: LocalOrderBook,
    http: IHttpClient,
    riskManager: IRiskManager,
    pair: symbolPair
  ) {
    this.localOrderBook = book
    this.httpClient = http
    this.riskManager = riskManager
    this.pair = pair
  }

  async bid() {
    const [symbolOne, symbolTwo] = this.pair
    const fundsToRisk = await this.riskManager.caclulateOrderAmount(symbolTwo)
    const [price] = this.localOrderBook.book.sides.bids[0]
    const priceToBidAt = calculateOrderPrice(price, 1, (cp, md, pm) => cp * md + pm)
    const quantityToBidAt = parseInt((fundsToRisk / priceToBidAt).toFixed(0))
    
    console.log(priceToBidAt, quantityToBidAt)
    // this.placeOrder('bid', priceToBidAt, quantityToBidAt, symbolOne)
  }

  private async placeOrder(side: string, price: number, quantity: number, symbol: string) {
    const res = await this.httpClient.signedRequest({
      url: '/api/v3/order/test',
      method: 'POST',
      params: {
        side,
        price,
        quantity,
        symbol: symbol,
        type: 'LIMIT'
      }
    })
    console.log(res)
  }
}