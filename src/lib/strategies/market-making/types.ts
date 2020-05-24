import { CandleChartResult, CandleChartArrayResult } from "../../binance-types"

export interface RequestInterface {
  symbol: string
}

export type TransformedCandleData = {
  symbol: string,
  data: CandleChartResult[]
}

export type TransformedCandleDataInput = {
  symbol: string,
  data: CandleChartArrayResult[]
}