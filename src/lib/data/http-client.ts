import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { HttpClientInterface } from './interfaces'

export default abstract class HttpClient implements HttpClientInterface {
  BASE: string

  constructor(baseUrl: string) {
    this.BASE = baseUrl
  }

  request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      axios({
        baseURL: this.BASE,
        ...config
      }).then(resolve)
        .catch(reject)
    })
  }

  abstract privateRequest(config: AxiosRequestConfig): Promise<AxiosResponse>
}