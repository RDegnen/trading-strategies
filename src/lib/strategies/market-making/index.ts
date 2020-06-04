import CoinSelector from "./coin-selector";
import RiskManager from "../../risk-manager";
import BinanceClient from "../../data/binance-client";
import WebSocketClient from "../../data/websocket-client";
import LocalOrderBook from "../../local-order-book";

export default async function marketMaker() {
  const httpClient = new BinanceClient('https://api.binance.us')
  const selector = new CoinSelector(
    httpClient,
    0.010000,
    50,
    3
  )
  const coins = await selector.findCoins()
  console.log(coins)

  const riskManager = new RiskManager(httpClient, .1)
  console.log(await riskManager.caclulateOrderAmount('BTC'))

  const socket = new WebSocketClient('wss://stream.binance.us:9443/ws/vetusdt@depth')

  const orderBook = new LocalOrderBook(
    socket,
    httpClient,
    'VETUSDT'
  )
}
