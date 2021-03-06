import { BinanceSymbol } from "../../../../src/lib/types/binance-types";

export default {
  symbol: 'VETUSDT',
  status: 'TRADING',
  baseAsset: 'VET',
  baseAssetPrecision: 8,
  quoteAsset: 'USDT',
  quotePrecision: 8,
  baseCommissionPrecision: 8,
  quoteCommissionPrecision: 8,
  quoteOrderQtyMarketAllowed: true,
  orderTypes: [
    'LIMIT',
    'LIMIT_MAKER',
    'MARKET',
    'STOP_LOSS_LIMIT',
    'TAKE_PROFIT_LIMIT'
  ],
  icebergAllowed: true,
  ocoAllowed: true,
  isSpotTradingAllowed: true,
  isMarginTradingAllowed: false,
  filters: [
    {
      filterType: 'PRICE_FILTER',
      minPrice: '0.00000100',
      maxPrice: '1000.00000000',
      tickSize: '0.00000100'
    },
    {
      filterType: 'PERCENT_PRICE',
      multiplierUp: '5',
      multiplierDown: '0.2',
      avgPriceMins: 5
    },
    {
      filterType: 'LOT_SIZE',
      minQty: '1.00000000',
      maxQty: '90000000.00000000',
      stepSize: '1.00000000'
    },
    {
      filterType: 'MIN_NOTIONAL',
      minNotional: '10.00000000',
      applyToMarket: true,
      avgPriceMins: 5
    },
    { filterType: 'ICEBERG_PARTS', limit: 10 },
    {
      filterType: 'MARKET_LOT_SIZE',
      minQty: '0.00000000',
      maxQty: '50000000.00000000',
      stepSize: '0.00000000'
    },
    { filterType: 'MAX_NUM_ALGO_ORDERS', maxNumAlgoOrders: 5 }
  ]
} as BinanceSymbol