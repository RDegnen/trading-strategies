import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { IHttpClient } from './interfaces'

export default abstract class HttpClient implements IHttpClient {
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

  abstract keyRequest(config: AxiosRequestConfig): Promise<AxiosResponse>

  abstract signedRequest(config: AxiosRequestConfig): Promise<AxiosResponse>
}