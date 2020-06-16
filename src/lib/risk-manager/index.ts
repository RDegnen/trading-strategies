import { WalletCurrencyInfo, AccountCoinInfo } from "../binance-types"
import { IHttpClient } from '../data/interfaces'

export interface IRiskManager {
  caclulateOrderAmount(symbol: string, riskPercent: number): Promise<number>
}

export default class RiskManager implements IRiskManager {
  httpClient: IHttpClient

  constructor(http: IHttpClient) {
    this.httpClient = http
  }

  async caclulateOrderAmount(symbol: string, riskPercent: number): Promise<number> {
    const allCoinInfo = await this.getAllCoinInfo()
    const defaultCoin = { free: '0.0' }

    const coin = allCoinInfo.find((currency: WalletCurrencyInfo) => currency.coin === symbol) || defaultCoin
    return parseFloat(coin.free) * riskPercent
  }

  private async getAllCoinInfo(): Promise<AccountCoinInfo[]> {
    return (await this.httpClient.signedRequest({
      url: '/sapi/v1/capital/config/getall'
    })).data
  }
}