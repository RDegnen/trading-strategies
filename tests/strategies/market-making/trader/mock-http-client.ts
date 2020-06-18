import { IHttpClient } from '../../../../src/lib/data/interfaces'
import { AxiosRequestConfig } from 'axios'

export default class MockHttpClient implements IHttpClient<any> {
  orderRequests: any[]
  newOrderId: number = 1

  constructor() {
    this.orderRequests = []
  }

  request(): Promise<any> {
    return new Promise(resolve => {
      resolve({
        data: {
          symbols: [
            {
              symbol: 'VETUSDT',
              status: 'TRADING',
              baseAsset: 'VET',
              baseAssetPrecision: 8,
              quoteAsset: 'USDT',
              quotePrecision: 8,
              baseCommissionPrecision: 8,
              quoteCommissionPrecision: 8,
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
            }
          ]
        }
      })
    })
  }

  keyRequest(): Promise<any> {
    return new Promise(resolve => {
      resolve('nothing')
    })
  }

  signedRequest(config: AxiosRequestConfig): Promise<any> {
    return new Promise(resolve => {
      const orderUrls = ['/api/v3/order/test', '/api/v3/order']
      
      if (config.url === '/sapi/v1/capital/config/getall') {
        const response = {
          data: [
            {
              coin: 'VET',
              depositAllEnable: true,
              free: '100.00000000',
              freeze: '0.00000000',
              ipoable: '0.00000000',
              ipoing: '0.00000000',
              isLegalMoney: false,
              locked: '0.00000000',
              name: 'VeChain',
              storage: '0.00000000',
              trading: true,
              withdrawAllEnable: true,
              withdrawing: '0.00000000'
            },
            {
              coin: 'USDT',
              depositAllEnable: true,
              free: '100.00000000',
              freeze: '0.00000000',
              ipoable: '0.00000000',
              ipoing: '0.00000000',
              isLegalMoney: false,
              locked: '0.00000000',
              name: 'TetherUS',
              storage: '0.00000000',
              trading: true,
              withdrawAllEnable: true,
              withdrawing: '0.00000000'
            }
          ]
        }

        resolve(response)
      } else if (orderUrls.includes(config.url || '')) {
        this.orderRequests.push({ 
          ...config,
          url: 'test' 
        })
        const response = {
          data: {
            orderId: this.newOrderId,
            status: 'NEW'
          }
        }
        this.newOrderId += 1
        resolve(response)
      }
    })
  }
}