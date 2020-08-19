import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { IHttpClient } from './interfaces'

export default abstract class HttpClient implements IHttpClient {
  constructor(protected baseUrl: string) {
    this.baseUrl = baseUrl
  }

  request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      axios({
        baseURL: this.baseUrl,
        ...config
      }).then(resolve)
        .catch(reject)
    })
  }

  abstract keyRequest(config: AxiosRequestConfig): Promise<AxiosResponse>

  abstract signedRequest(config: AxiosRequestConfig): Promise<AxiosResponse>
}