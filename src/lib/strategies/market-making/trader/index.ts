import { IHttpClient } from "../../../data/interfaces"
import { ILocalOrderBook } from '../../../local-order-book'
import { IRiskManager } from '../../../risk-manager'
import { calculateOrderPrice } from './utils'
import { 
  IAccountSubject,
  IAccountObserver,
  AccountEventTypes
} from "../../../types"
import { 
  OrderUpdate,
  OrderSide,
  OrderType,
  TimeInForce,
  OrderStatus,
  OrderStatusType
} from "../../../binance-types"
import { remove } from "ramda"

type symbolPair = [string, string]
type openOrdersType = {
  i: number,
  X: OrderStatusType
}

export default class Trader implements IAccountObserver {
  private localOrderBook: ILocalOrderBook
  private httpClient: IHttpClient
  private riskManager: IRiskManager
  private accountMonitor: IAccountSubject
  private pair: symbolPair
  private openOrders: openOrdersType[]

  constructor(
    book: ILocalOrderBook,
    http: IHttpClient,
    riskManager: IRiskManager,
    accountMonitor: IAccountSubject,
    pair: symbolPair
  ) {
    this.localOrderBook = book
    this.httpClient = http
    this.riskManager = riskManager
    this.accountMonitor = accountMonitor
    this.pair = pair
    this.openOrders = []

    this.accountMonitor.attach(this, AccountEventTypes.ORDER)
  }

  async bid() {
    const [symbolOne, symbolTwo] = this.pair
    const fundsToRisk = await this.riskManager.caclulateOrderAmount(symbolTwo, .1)
    const [price] = this.localOrderBook.book.sides.bids[0]
    const priceToBidAt = calculateOrderPrice(price, 1, (cp, md, pm) => cp * md + pm)
    const quantityToBidAt = parseInt((fundsToRisk / priceToBidAt).toFixed(0))
    
    // console.log(priceToBidAt, quantityToBidAt)
    this.placeOrder(OrderSide.BUY, priceToBidAt, quantityToBidAt, this.pair.join(''))
  }

  async ask() {
    const [symbolOne] = this.pair
    const [price] = this.localOrderBook.book.sides.asks[0]
    const priceToAskFor = calculateOrderPrice(price, 1, (cp, md, pm) => cp * md - pm)
    const quantityToAskFor = await this.riskManager.caclulateOrderAmount(symbolOne, 1)

    this.placeOrder(OrderSide.SELL, priceToAskFor, quantityToAskFor, this.pair.join(''))
  }

  async update(data: OrderUpdate) {
    const { S, X, i, } = data
    if (S === OrderSide.BUY) {
       if (X === OrderStatus.FILLED) {
        const orderIndex = this.openOrders.findIndex(order => order.i === i)
        if (orderIndex > -1) {
          const updatedOpenOrders = remove(
            orderIndex,
            1,
            this.openOrders
          )
          this.openOrders = updatedOpenOrders
          this.ask()
        }
      }
    }
  }

  private async placeOrder(side: string, price: number, quantity: number, symbol: string) {
    const res = (await this.httpClient.signedRequest({
      url: '/api/v3/order/test',
      method: 'POST',
      params: {
        side,
        price,
        quantity,
        symbol: symbol,
        type: OrderType.LIMIT,
        timeInForce: TimeInForce.GOOD_TILL_CANCELED
      }
    })).data
    
    this.openOrders.push({ i: res.orderId, X: res.status })
  }
}