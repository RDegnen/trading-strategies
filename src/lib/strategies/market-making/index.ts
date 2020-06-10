import CoinSelector from "./coin-selector"
import RiskManager from "../../risk-manager"
import BinanceClient from "../../data/binance-client"
import WebSocketClient from "../../data/websocket-client"
import LocalOrderBook from "../../local-order-book"
import Trader from './trader'

export default async function marketMaker() {
  const httpClient = new BinanceClient('https://api.binance.us')
  const riskManager = new RiskManager(httpClient, .1)
  const selector = new CoinSelector(
    httpClient,
    0.010000,
    50,
    3
  )
  // Could be useful to look for the best spread return (ask/bid - 1 * 100)
  const coins = await selector.findCoins()
  //console.log(coins)

  const socket = new WebSocketClient('wss://stream.binance.us:9443/ws/vetusdt@depth')

  const orderBook = new LocalOrderBook(
    socket,
    httpClient,
    'VETUSDT'
  )

  const trader = new Trader(
    orderBook,
    httpClient,
    riskManager,
    ['VET', 'USDT']
  )

  trader.bid()
}
