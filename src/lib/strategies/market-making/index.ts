import HttpClient from "../../data/http-client";
import { AxiosResponse } from "axios";
import { 
  BidAskPrice,
  Ticker,
  CandleChartResult,
  CandleChartInterval,
  CandleChartArrayResult
} from "../../binance-types";
import { ADX } from 'technicalindicators'
import { ADXInput, ADXOutput } from "technicalindicators/declarations/directionalmovement/ADX";

function filterOutNonBTC(prices: BidAskPrice[]): BidAskPrice[] {
  return prices.filter(price => {
    return price.symbol.includes('BTC')
  })
}

function filterOutExpensiveCoins(prices: BidAskPrice[]): BidAskPrice[] {
  return prices.filter(price => {
    return parseFloat(price.bidPrice) < 0.00000100
  })
}

function filterOutDirtCheapCoins(prices: BidAskPrice[]): BidAskPrice[] {
  return prices.filter(price => {
    return parseFloat(price.bidPrice) > 0.00000000
  })
}

function calculateIfChartIsRanging(
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

async function coinSelector() {
  const orderBooks: Promise<AxiosResponse<any>>[] = []
  const httpClient = new HttpClient('https://api.binance.com')
  const bidAskPrices: BidAskPrice[] = (await httpClient.request({ 
    url: '/api/v3/ticker/bookTicker',
  })).data

  const btcData = filterOutNonBTC(bidAskPrices)
  const cheapCoins = filterOutExpensiveCoins(btcData)
  const notDirtCheapCoins = filterOutDirtCheapCoins(cheapCoins)

  const orderBookSymbols = notDirtCheapCoins.map(({ symbol }) => symbol)
  orderBookSymbols.forEach(symbol => {
    orderBooks.push(httpClient.request({
      url: '/api/v3/depth',
      params: { symbol }
    }))
  })

  const symbolInfo: Promise<AxiosResponse<any>>[] = []
  const resolvedOrderBooks =  (await Promise.all(orderBooks))
    .map(({ data, config }) => ({ data, symbol: config.params.symbol }))
    .filter(book => book.data.bids.length > 50)

  resolvedOrderBooks.forEach(({ symbol }) => {
    symbolInfo.push(httpClient.request({
      url: '/api/v3/ticker/24hr',
      params: { symbol }
    }))
  })

  const resolvedSymbolInfo: Ticker[] = (await Promise.all(symbolInfo))
    .map(({ data }) => data)
    .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))

  const candlestickData: Promise<AxiosResponse<any>>[] = []
  resolvedSymbolInfo
    .slice(0, 3)
    .forEach(({ symbol }) => {
      candlestickData.push(httpClient.request({
        url: '/api/v3/klines',
        params: { 
          symbol,
          interval: CandleChartInterval.ONE_MINUTE,
          limit: 500
        }
      }))
    })

  const resolvedCandlestickData = (await Promise.all(candlestickData))
    .map(({ data, config }) => ({ data, symbol: config.params.symbol }))
    .map(({ data, symbol}) => {
      const transformedCandleData: CandleChartResult[] = 
        data.map((candleStickResult: CandleChartArrayResult) => ({
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

      return {
        symbol,
        data: transformedCandleData
      }
    })

  resolvedCandlestickData.forEach(({ data, symbol }) => {
    const rangingSymbols: boolean = calculateIfChartIsRanging(data, 30) < 25
    console.log(symbol, rangingSymbols)
  })
}

export {
  coinSelector
}