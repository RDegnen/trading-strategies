export type Ticker = {
  eventType: string,
  eventTime: number,
  symbol: string,
  priceChange: string,
  priceChangePercent: string,
  weightedAvg: string,
  prevDayClose: string,
  curDayClose: string,
  closeTradeQuantity: string,
  bestBid: string,
  bestBidQnt: string,
  bestAsk: string,
  bestAskQnt: string,
  open: string,
  high: string,
  low: string,
  volume: string,
  volumeQuote: string,
  openTime: number,
  closeTime: number,
  firstTradeId: number,
  lastTradeId: number,
  totalTrades: number
}

export type BidAskPrice = {
  symbol: string,
  bidPrice: string,
  bidQty: string,
  askPrice: string,
  askQty: string
}


export type CandleChartResult = {
  openTime: number,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string,
  closeTime: number,
  quoteVolume: string,
  trades: number,
  baseAssetVolume: string,
  quoteAssetVolume: string
}

export type CandleChartArrayResult = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string
]

export enum CandleChartInterval {
  ONE_MINUTE = '1m',
  THREE_MINUTES = '3m',
  FIVE_MINUTES = '5m',
  FIFTEEN_MINUTES = '15m',
  THIRTY_MINUTES = '30m',
  ONE_HOUR = '1h',
  TWO_HOURS = '2h',
  FOUR_HOURS = '4h',
  SIX_HOURS = '6h',
  EIGHT_HOURS = '8h',
  TWELVE_HOURS = '12h',
  ONE_DAY = '1d',
  THREE_DAYS = '3d',
  ONE_WEEK = '1w',
  ONE_MONTH = '1M'
}

export type WalletCurrencyInfo = {
  coin: string,
  depositAllEnable: boolean,
  free: string,
  freeze: string,
  ipoable: string,
  ipoing: string,
  isLegalMoney: boolean,
  locked: string,
  name: string,
  networkList: any,
  storage: string,
  trading: boolean,
  withdrawAllEnable: boolean,
  withdrawing: string
}