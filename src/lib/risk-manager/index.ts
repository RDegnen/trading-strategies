import { WalletCurrencyInfo } from "../binance-types"
import { IHttpClient } from '../data/interfaces'

export default class RiskManager {
  httpClient: IHttpClient
  riskPercent: number

  constructor(http: IHttpClient, risk: number) {
    this.httpClient = http
    this.riskPercent = risk
  }

  async caclulateOrderAmount(symbol: string) {
    const allCoinInfo = (await this.httpClient.privateRequest({
      url: '/sapi/v1/capital/config/getall'
    })).data

    const coin = allCoinInfo.find((currency: WalletCurrencyInfo) => currency.coin === symbol)
    return parseFloat(coin.free) * this.riskPercent
  }
}