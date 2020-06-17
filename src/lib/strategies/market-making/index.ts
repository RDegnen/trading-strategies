import CoinSelector from "./coin-selector"
import RiskManager from "../../risk-manager"
import BinanceClient from "../../data/binance-client"
import WebSocketClient from "../../data/websocket-client"
import LocalOrderBook from "../../local-order-book"
import Trader from './trader'
import AccountMonitor from '../../account-monitor'

export default async function marketMaker() {
  try {
    const httpClient = new BinanceClient('https://api.binance.us')
    const riskManager = new RiskManager(httpClient)
    const accountMonitor = new AccountMonitor(httpClient, new WebSocketClient())
    const selector = new CoinSelector(
      httpClient,
      0.010000,
      50,
      3
    )
    // Could be useful to look for the best spread return (ask/bid - 1 * 100)
    const coins = await selector.findCoins()

    const orderBook = new LocalOrderBook(
      new WebSocketClient(),
      httpClient,
      'VETUSDT'
    )

    const trader = new Trader(
      orderBook,
      httpClient,
      riskManager,
      accountMonitor,
      ['VET', 'USDT']
    )

    trader.bid()
  } catch (err) {
    console.log(err)
  }
}
