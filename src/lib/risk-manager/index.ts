import { WalletCurrencyInfo, AccountCoinInfo } from "../types/binance-types"
import { IHttpClient } from '../data-sources/interfaces'

export interface IRiskManager {
  caclulateOrderAmount(symbol: string, riskPercent: number): Promise<number>
}

export default class RiskManager implements IRiskManager {
  constructor(private httpClient: IHttpClient) {
    this.httpClient = httpClient
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