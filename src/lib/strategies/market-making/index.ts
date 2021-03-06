import RiskManager from "../../risk-manager"
import BinanceClient from "../../data-sources/binance-client"
import WebSocketClient from "../../data-sources/websocket-client"
import LocalOrderBook from "../../local-order-book"
import Trader from './trader'
import AccountMonitor from '../../account-monitor'
import { Logger } from "pino"
import { BinanceSymbol } from "../../types/binance-types"
import { IHttpClient } from "../../data-sources/interfaces"
import OrderManager from "./trader/order-manager"

const getExchangeSymbolInfo = async (httpClient: IHttpClient): Promise<BinanceSymbol[]> => {
  return (await httpClient.request({
    url: '/api/v3/exchangeInfo'
  })).data.symbols
}
/**
 * 
 * Sidelined for now.
 */
export default async function marketMaker(logger: Logger) {
  try {
    const httpClient = new BinanceClient('https://api.binance.us')
    const exchangeSymbolInfo: BinanceSymbol[] = await getExchangeSymbolInfo(httpClient)
    const riskManager = new RiskManager(httpClient)
    const accountMonitor = new AccountMonitor(
      httpClient,
      new WebSocketClient(),
      logger
    )

    const orderBook = new LocalOrderBook(
      new WebSocketClient(),
      httpClient,
      'BTCUSDT'
    )

    const openOrderManager = new OrderManager()

    const trader = new Trader(
      logger,
      orderBook,
      httpClient,
      riskManager,
      accountMonitor,
      exchangeSymbolInfo,
      ['BTC', 'USDT'],
      .25,
      openOrderManager
    )

    trader.bid(1)
  } catch (err) {
    logger.error(err)
  }
}
