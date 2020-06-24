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
  OrderTypeEnum,
  TimeInForce,
  OrderStatus,
  OrderStatusType,
  BinanceSymbol,
  SymbolPriceFilter
} from "../../../binance-types"
import { remove } from "ramda"
import { Logger } from "pino"

type symbolPair = [string, string]
type openOrdersType = {
  i: number
}

export default class Trader implements IAccountObserver {
  private localOrderBook: ILocalOrderBook
  private httpClient: IHttpClient
  private riskManager: IRiskManager
  private accountMonitor: IAccountSubject
  private pair: symbolPair
  private openOrders: openOrdersType[]
  private riskPercent: number
  private logger: Logger

  constructor(
    logger: Logger,
    book: ILocalOrderBook,
    http: IHttpClient,
    riskManager: IRiskManager,
    accountMonitor: IAccountSubject,
    pair: symbolPair,
    risk: number
  ) {
    this.logger = logger
    this.localOrderBook = book
    this.httpClient = http
    this.riskManager = riskManager
    this.accountMonitor = accountMonitor
    this.pair = pair
    this.openOrders = []
    this.riskPercent = risk

    this.accountMonitor.attach(this, AccountEventTypes.ORDER)
  }

  async bid(priceMove: number) {
    const [symbolOne, symbolTwo] = this.pair
    const fundsToRisk = await this.riskManager.caclulateOrderAmount(symbolTwo, this.riskPercent)
    const [price] = this.localOrderBook.book.sides.bids[0]
    const symbolInfo = await this.getSymbolInfo()
    const fn = (priceMove: number) => (temp: number) => temp + priceMove
    const priceFilter = symbolInfo.filters.find(filter => {
      return filter.filterType === 'PRICE_FILTER'
    })
    if (priceFilter && 'tickSize' in priceFilter) {
      const priceToBidAt = calculateOrderPrice(price, priceFilter, fn(priceMove))
      const quantityToBidAt = parseInt((fundsToRisk / parseFloat(priceToBidAt)).toFixed(0))
      this.placeOrder(OrderSide.BUY, priceToBidAt, quantityToBidAt, this.pair.join(''))
    }
  }

  async ask() {
    const [symbolOne] = this.pair
    const [price] = this.localOrderBook.book.sides.asks[0]
    const symbolInfo = await this.getSymbolInfo()
    const fn = (priceMove: number) => (temp: number) => temp - priceMove
    const priceFilter = symbolInfo.filters.find(filter => {
      return filter.filterType === 'PRICE_FILTER'
    })
    if (priceFilter && 'tickSize' in priceFilter) {
      const priceToAskFor = calculateOrderPrice(price, priceFilter, fn(1))
      const quantityToAskFor = await this.riskManager.caclulateOrderAmount(symbolOne, 1)
      this.placeOrder(OrderSide.SELL, priceToAskFor, quantityToAskFor, this.pair.join(''))
    }
  }

  private async getSymbolInfo(): Promise<BinanceSymbol> {
    const [symbolOne, symbolTwo] = this.pair
    const allSymbols = (await this.httpClient.request({
      url: '/api/v3/exchangeInfo'
    })).data.symbols
    
    return allSymbols.find((sym: BinanceSymbol) => {
      if (sym.baseAsset === symbolOne && sym.quoteAsset === symbolTwo) {
        return sym
      }
    })
  }

  async update(data: OrderUpdate) {
    const { S, X, i, } = data
    if (S === OrderSide.BUY) {
       if (X === OrderStatus.FILLED) {
        const orderIndex = this.openOrders.findIndex(order => order.i === i)
        if (orderIndex > -1) {
          this.removeOrderFromOpenOrders(orderIndex)
          this.ask()
        }
      } else if (X === OrderStatus.CANCELED) {
        const orderIndex = this.openOrders.findIndex(order => order.i === i)
        if (orderIndex > -1) {
          this.removeOrderFromOpenOrders(orderIndex)
        }
      }
    }
  }

  private async placeOrder(side: string, price: string, quantity: number, symbol: string) {
    try {
      const res = (await this.httpClient.signedRequest({
        url: '/api/v3/order',
        method: 'POST',
        params: {
          side,
          price,
          quantity,
          symbol: symbol,
          type: OrderTypeEnum.LIMIT,
          timeInForce: TimeInForce.GOOD_TILL_CANCELED
        }
      })).data
      this.logger.info(`Order ${res.orderId} placed. symbol: ${symbol} - side: ${side} - price: ${price} - quantity: ${quantity}`)
      this.openOrders.push({ i: res.orderId })
    } catch (err) {
      this.logger.error(err.response.data)
    }
  }

  private removeOrderFromOpenOrders(orderIndex: number) {
    const updatedOpenOrders = remove(orderIndex, 1, this.openOrders)
    this.openOrders = updatedOpenOrders
  }
}