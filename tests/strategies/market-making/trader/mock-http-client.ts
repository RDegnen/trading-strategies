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
      resolve('nothing')
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
        this.orderRequests.push(config)
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