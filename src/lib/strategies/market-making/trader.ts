import { IHttpClient } from "../../data/interfaces"
import LocalOrderBook from '../../local-order-book'
import { IRiskManager } from '../../risk-manager'

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
    const [price, quantity] = this.localOrderBook.book.sides.bids[0]
    const priceToBidAt = this.calculateOrderPrice(price, 1)
    const quantityToBidAt = parseInt((fundsToRisk / priceToBidAt).toFixed(0))
    
    console.log(priceToBidAt, quantityToBidAt)
    this.placeOrder('bid', priceToBidAt, quantityToBidAt, symbolOne)
  }

  private calculateOrderPrice(currentPrice: string, priceAddition: number): number {
    const decimalList = parseFloat(currentPrice)
      .toString()
      .split('')
      .filter(val => val != '.')

    let stringBuilder = '1'
    for (let i = 0; i < decimalList.length; i++) {
      if (i > 0) {
        stringBuilder += '0'
      }
    }

    const multiplierDivisor = parseInt(stringBuilder)
    const adjustedPriceInt = parseFloat(currentPrice) * multiplierDivisor + priceAddition

    return adjustedPriceInt / multiplierDivisor
  }

  private async placeOrder(side: string, price: number, quantity: number, symbol: string) {
    const res = await this.httpClient.privateRequest({
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