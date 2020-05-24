import HttpClient from "../../data/http-client";
import CoinSelector from "./coin-selector";

async function coinSelector() {
  const httpClient = new HttpClient('https://api.binance.com')
  const selector = new CoinSelector(
    httpClient,
    0.00000100,
    50,
    3
  )
  console.log(await selector.findCoins())
}

export {
  coinSelector
}