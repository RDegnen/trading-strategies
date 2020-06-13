import { WalletCurrencyInfo } from "../binance-types"
import { IHttpClient } from '../data/interfaces'

export interface IRiskManager {
  caclulateOrderAmount(symbol: string): Promise<number>
}

export default class RiskManager implements IRiskManager {
  httpClient: IHttpClient
  riskPercent: number

  constructor(http: IHttpClient, risk: number) {
    this.httpClient = http
    this.riskPercent = risk
  }

  async caclulateOrderAmount(symbol: string): Promise<number> {
    const allCoinInfo = (await this.httpClient.signedRequest({
      url: '/sapi/v1/capital/config/getall'
    })).data

    const coin = allCoinInfo.find((currency: WalletCurrencyInfo) => currency.coin === symbol)
    return parseFloat(coin.free) * this.riskPercent
  }
}