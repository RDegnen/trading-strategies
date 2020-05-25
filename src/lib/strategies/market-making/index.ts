import CoinSelector from "./coin-selector";
import RiskManager from "../../risk-manager";
import BinanceClient from "../../data/binance-client";

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

  const riskManager = new RiskManager(httpClient, 0.1)
  console.log(await riskManager.caclulateOrderAmount('BTC'))
}
