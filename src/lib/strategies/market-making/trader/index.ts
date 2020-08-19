import { IHttpClient } from "../../../data-sources/interfaces"
import { ILocalOrderBook } from '../../../local-order-book'
import { IRiskManager } from '../../../risk-manager'
import { calculateOrderPrice, filterOrderQuantity } from './utils'
import OrderManager, { OrderStatus as OrderManagerStatus } from './order-manager'
import {
  AccountEventTypes,
  ISubject,
  IAccountUpdateEvent,
  IObserver
} from "../../../types/types"
import { 
  OrderUpdate,
  OrderSide,
  OrderTypeEnum,
  TimeInForce,
  OrderStatus,
  BinanceSymbol,
  SymbolFilterTypeEnum,
  SymbolPriceFilter,
  SymbolLotSizeFilter
} from "../../../types/binance-types"
import { Logger } from "pino"

type symbolPair = [string, string]

export default class Trader implements IObserver<IAccountUpdateEvent> {
  private logger: Logger
  private localOrderBook: ILocalOrderBook
  private httpClient: IHttpClient
  private riskManager: IRiskManager
  private accountMonitor: ISubject<IObserver<IAccountUpdateEvent>, IAccountUpdateEvent>
  private exchangeSymbolInfo: BinanceSymbol[]
  private pair: symbolPair
  private riskPercent: number
  private openOrderManager: OrderManager

  constructor(
    logger: Logger,
    book: ILocalOrderBook,
    http: IHttpClient,
    riskManager: IRiskManager,
    accountMonitor: ISubject<IObserver<IAccountUpdateEvent>, IAccountUpdateEvent>,
    exchangeSymbolInfo: BinanceSymbol[],
    pair: symbolPair,
    risk: number,
    openOrderManager: OrderManager
  ) {
    this.logger = logger
    this.localOrderBook = book
    this.httpClient = http
    this.riskManager = riskManager
    this.accountMonitor = accountMonitor
    this.exchangeSymbolInfo = exchangeSymbolInfo
    this.pair = pair
    this.riskPercent = risk
    this.openOrderManager = openOrderManager

    this.accountMonitor.attach(this, AccountEventTypes.ORDER)
  }

  bid = async (priceOffset: number) => {
    const [symbolOne, symbolTwo] = this.pair
    const fundsToRisk = await this.riskManager.caclulateOrderAmount(symbolTwo, this.riskPercent)
    const [price] = this.localOrderBook.book.sides.bids[0]
    const fn = (priceOffset: number) => (temp: number) => temp + priceOffset
    const priceToBidAt = calculateOrderPrice(price, this.getPriceFilter(), fn(priceOffset))
    const quantityToBidAt = filterOrderQuantity(
      this.getLotSizeFilter(),
      parseInt((fundsToRisk / parseFloat(priceToBidAt)).toFixed(0))
    )
    this.placeOrder(OrderSide.BUY, priceToBidAt, quantityToBidAt, this.pair.join(''))
  }

  ask = async (priceOffset: number) => {
    const [symbolOne] = this.pair
    const [price] = this.localOrderBook.book.sides.asks[0]
    const fn = (priceOffset: number) => (temp: number) => temp - priceOffset
    const priceToAskFor = calculateOrderPrice(price, this.getPriceFilter(), fn(priceOffset))
    const quantityToAskFor = filterOrderQuantity(
      this.getLotSizeFilter(),
      await this.riskManager.caclulateOrderAmount(symbolOne, 1)
    )
    this.placeOrder(OrderSide.SELL, priceToAskFor, quantityToAskFor, this.pair.join(''))
  }

  private getPriceFilter (): SymbolPriceFilter {
    const symbolInfo = this.getSymbolInfo()
    return symbolInfo.filters.find(filter => {
      return filter.filterType === SymbolFilterTypeEnum.PRICE_FILTER
    }) as SymbolPriceFilter
  }

  private getLotSizeFilter (): SymbolLotSizeFilter {
    const symbolInfo = this.getSymbolInfo()
    return symbolInfo.filters.find(filter => {
      return filter.filterType === SymbolFilterTypeEnum.LOT_SIZE
    }) as SymbolLotSizeFilter
  }

  private getSymbolInfo (): BinanceSymbol {
    const [symbolOne, symbolTwo] = this.pair
    
    return this.exchangeSymbolInfo.find((sym: BinanceSymbol) => {
      if (sym.baseAsset === symbolOne && sym.quoteAsset === symbolTwo) {
        return sym
      }
    }) as BinanceSymbol
  }

  async update (data: OrderUpdate) {
    const { S, X, i, } = data
    if (S === OrderSide.BUY) {
       if (X === OrderStatus.FILLED) {
        this.openOrderManager.closeOrder(i)
        this.ask(1)
      } else if (X === OrderStatus.CANCELED) {
        this.openOrderManager.closeOrder(i)
      }
    } else if (S === OrderSide.SELL) {
      if (X === OrderStatus.FILLED) {
        this.openOrderManager.closeOrder(i)
        this.bid(1)
      } else if (X === OrderStatus.CANCELED) {
        this.openOrderManager.closeOrder(i)
      }
    }
  }

  private async placeOrder (side: string, price: string, quantity: number, symbol: string) {
    try {
      const res = (await this.httpClient.signedRequest({
        url: '/api/v3/order/test',
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
      this.openOrderManager.addOrder({ 
        i: res.orderId,
        side,
        price,
        quantity,
        status: OrderManagerStatus.OPEN
      })
    } catch (err) {
      this.logger.error(err.response.data)
    }
  }
}