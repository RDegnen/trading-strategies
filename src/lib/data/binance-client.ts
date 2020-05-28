import HttpClient from "./http-client"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { createHmac } from 'crypto'

export default class BinanceClient extends HttpClient {
  privateRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      this.getServerTime()
        .then(time => {
          const queryParams = {
            ...config["params"],
            timestamp: time
          }
          const queryString = Object.keys(queryParams)
            .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k])}`)
            .join('&')

          axios({
            ...config,
            baseURL: this.BASE,
            headers: {
              'X-MBX-APIKEY': process.env.BINANCE_US_KEY,
              ...config["headers"]
            },
            params: {
              ...queryParams,
              signature: createHmac('sha256', process.env.BINANCE_US_SECRET || '')
                .update(queryString)
                .digest('hex')
            }
          }).then(resolve)
            .catch(reject)
        })
        .catch(reject)
    })
  }

  async getServerTime(): Promise<number> {
    const { data } = await this.request({ url: '/api/v3/time '})
    return data.serverTime
  }
}