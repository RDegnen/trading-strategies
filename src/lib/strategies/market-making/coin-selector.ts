import { AxiosResponse, AxiosRequestConfig } from "axios"
import { 
  BidAskPrice,
  CandleChartResult,
  CandleChartInterval,
  CandleChartArrayResult
} from "../../binance-types"
import { ADX } from 'technicalindicators'
import { 
  ADXInput, 
  ADXOutput 
} from "technicalindicators/declarations/directionalmovement/ADX"
import { compose } from 'ramda'
import { 
  RequestInterface, 
  TransformedCandleDataInput, 
  TransformedCandleData 
} from "./types"
import { HttpClientInterface } from "../../data/interfaces"

export default class CoinSelector {
  httpClient: HttpClientInterface
  maxBidPrice: number
  orderBookDepth: number
  amountOfCoinsToTrade: number

  constructor(
    http: HttpClientInterface,
    bidPrice: number,
    depth: number,
    coinAmount: number
  ) {
    this.httpClient = http
    this.maxBidPrice = bidPrice
    this.orderBookDepth = depth
    this.amountOfCoinsToTrade = coinAmount
  }

  async findCoins(): Promise<string[]> {
    const bidAskPrices: BidAskPrice[] = (await this.httpClient.request({
      url: '/api/v3/ticker/bookTicker'
    })).data

    const coinsFilteredByPrice = this.filterCoinsByPrice(bidAskPrices)
    const resolvedOrderBooks = 
      (await Promise.all(this.createRequests(coinsFilteredByPrice, '/api/v3/depth')))
      .map(({ data, config }) => ({ data, symbol: config.params.symbol }))
      .filter(book => book.data.bids.length > this.orderBookDepth)

    const resolvedTickerInfo =
      (await Promise.all(this.createRequests(resolvedOrderBooks, '/api/v3/ticker/24hr')))
      .map(({ data }) => data)
      .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))

    const resolvedCandleStickData = 
      (await Promise.all(this.createRequests(
        resolvedTickerInfo.slice(0, this.amountOfCoinsToTrade),
        '/api/v3/klines',
        { interval: CandleChartInterval.ONE_MINUTE, limit: 500 }
      )))
      .map(({ data, config }) => ({ data, symbol: config.params.symbol }))
      .map(this.transformCandleData)
        
    const coinsToTrade: string[] = []
    resolvedCandleStickData.forEach(({ data, symbol }) => {
      console.log(this.calculateIfChartIsRanging(data, 14), symbol)
      if (this.calculateIfChartIsRanging(data, 14) < 25) {
        coinsToTrade.push(symbol)
      }
    })

    return coinsToTrade
  }

  private filterCoinsByPrice(prices: BidAskPrice[]): BidAskPrice[] {
    return compose(
      this.filterOutDirtCheapCoins,
      this.filterOutExpensiveCoins,
      this.filterOutNonBTC
    ).call(this, prices)
  }

  private filterOutNonBTC(prices: BidAskPrice[]): BidAskPrice[] {
    return prices.filter(price => {
      return price.symbol.includes('BTC')
    })
  }

  private filterOutExpensiveCoins(prices: BidAskPrice[]): BidAskPrice[] {
    return prices.filter(price => {
      return parseFloat(price.bidPrice) < this.maxBidPrice
    })
  }
  
  private filterOutDirtCheapCoins(prices: BidAskPrice[]): BidAskPrice[] {
    return prices.filter(price => {
      return parseFloat(price.bidPrice) > 0.00000000
    })
  }

  private createRequests(
    prices: RequestInterface[],
    url: string,
    requestParams: AxiosRequestConfig["params"] = {}
  ): Promise<AxiosResponse<any>>[] {
    const requests: Promise<AxiosResponse<any>>[] = []

    prices.forEach(({ symbol }) => {
      requests.push(this.httpClient.request({
        url,
        params: { 
          symbol,
          ...requestParams
        }
      }))
    })

    return requests
  }

  private transformCandleData(
    { data, symbol }: TransformedCandleDataInput
  ): TransformedCandleData {
    return {
      symbol,
      data: data.map((candleStickResult: CandleChartArrayResult) => ({
        openTime: candleStickResult[0],
        open: candleStickResult[1],
        high: candleStickResult[2],
        low: candleStickResult[3],
        close: candleStickResult[4],
        volume: candleStickResult[5],
        closeTime: candleStickResult[6],
        quoteVolume: candleStickResult[7],
        trades: candleStickResult[8],
        baseAssetVolume: candleStickResult[9],
        quoteAssetVolume: candleStickResult[10]
      }))
    }
  }

  private calculateIfChartIsRanging(
    data: CandleChartResult[],
    period: number
  ): number {
    const input: ADXInput = {
      close: [],
      high: [],
      low: [],
      period
    }
  
    data.forEach(({ close, high, low }) => {
      input.close.push(parseFloat(close))
      input.high.push(parseFloat(high))
      input.low.push(parseFloat(low))
    })
  
    const results: ADXOutput[] = new ADX(input).getResult()
    return results
      .map(({ adx }) => adx)
      .reduce((acc, current) => {
        return acc + current
      }, 0) / results.length
  }
}