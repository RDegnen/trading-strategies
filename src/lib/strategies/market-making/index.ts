import CoinSelector from "./coin-selector"
import RiskManager from "../../risk-manager"
import BinanceClient from "../../data/binance-client"
import WebSocketClient from "../../data/websocket-client"
import LocalOrderBook from "../../local-order-book"
import Trader from './trader'
import AccountMonitor from '../../account-monitor'
import { Logger } from "pino"
import { BinanceSymbol } from "../../binance-types"
import { IHttpClient } from "../../data/interfaces"

const getExchangeSymbolInfo = async (httpClient: IHttpClient): Promise<BinanceSymbol[]> => {
  return (await httpClient.request({
    url: '/api/v3/exchangeInfo'
  })).data.symbols
}

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
      'VETUSDT'
    )

    const trader = new Trader(
      logger,
      orderBook,
      httpClient,
      riskManager,
      accountMonitor,
      exchangeSymbolInfo,
      ['VET', 'USDT'],
      .25
    )

    trader.bid(1)
  } catch (err) {
    logger.error(err)
  }
}
