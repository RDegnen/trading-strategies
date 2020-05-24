import HttpClient from "../../data/http-client";
import CoinSelector from "./coin-selector";

export default async function marketMaker() {
  const httpClient = new HttpClient('https://api.binance.us')
  const selector = new CoinSelector(
    httpClient,
    0.010000,
    50,
    3
  )
  const coins = await selector.findCoins()
  console.log(coins)
}
