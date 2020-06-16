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

export type DiffDepthStream = {
  e: string,
  E: number,
  s: string,
  U: number,
  u: number,
  b: string[][],
  a: string[][]
}

export type OrderUpdate = {
  e: string,        // Event type
  E: number,            // Event time
  s: string,                 // Symbol
  c: string, // Client order ID
  S: string,                    // Side
  o: string,                  // Order type
  f: string,                    // Time in force
  q: string,             // Order quantity
  p: string,             // Order price
  P: string,             // Stop price
  F: string,             // Iceberg quantity
  g: number,                       // OrderListId
  C: number | null,                     // Original client order ID; This is the ID of the order being canceled
  x: string,                    // Current execution type
  X: string,                    // Current order status
  r: string,                   // Order reject reason; will be an error code.
  i: number,                  // Order ID
  l: string,             // Last executed quantity
  z: string,             // Cumulative filled quantity
  L: string,             // Last executed price
  n: string,                      // Commission amount
  N: string | null,                     // Commission asset
  T: number,            // Transaction time
  t: number,                       // Trade ID
  I: number,                  // Ignore
  w: boolean,                     // Is the order on the book?
  m: boolean,                    // Is this trade the maker side?
  M: boolean,                    // Ignore
  O: number,            // Order creation time
  Z: string,             // Cumulative quote asset transacted quantity
  Y: string,             // Last quote asset transacted quantity (i.e. lastPrice * lastQty)
}

export type AccountCoinInfo = {
  coin: string,
  depositAllEnable: boolean,
  free: string,
  freeze: string,
  ipoable: string,
  ipoing: string,
  isLegalMoney: boolean,
  locked: string,
  name: string,
  networkList: NetworkListType[],
  storage: string,
  trading: boolean,
  withdrawAllEnable: boolean,
  withdrawing: string
}

type NetworkListType = {
  addressRegex: string,
  coin: string,
  depositDesc: string,
  depositEnable: boolean,
  isDefault: boolean,
  memoRegex: string,
  minConfirm: number,
  name: string,
  network: string,
  resetAddressStatus: boolean,
  specialTips: string,
  unLockConfirm: number,
  withdrawDesc: string,
  withdrawEnable: boolean,
  withdrawFee: string,
  withdrawMin: string
}


export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum OrderType {
  LIMIT = 'LIMIT',
  LIMIT_MAKER = 'LIMIT_MAKER',
  MARKET = 'MARKET',
  STOP_LOSS = 'STOP_LOSS',
  STOP_LOSS_LIMIT = 'STOP_LOSS_LIMIT',
  TAKE_PROFIT = 'TAKE_PROFIT',
  TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT',
}

export enum OrderStatus {
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  FILLED = 'FILLED',
  NEW = 'NEW',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  PENDING_CANCEL = 'PENDING_CANCEL',
  REJECTED = 'REJECTED'
}
export type OrderStatusType =
  | 'CANCELED'
  | 'EXPIRED'
  | 'FILLED'
  | 'NEW'
  | 'PARTIALLY_FILLED'
  | 'PENDING_CANCEL'
  | 'REJECTED'

export enum TimeInForce {
  GOOD_TILL_CANCELED = 'GTC',
  IMMEDIATE_OR_CANCEL = 'IOC',
  FILL_OR_KILL = 'FOK'
}