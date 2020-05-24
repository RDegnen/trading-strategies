import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

interface HttpClientInterface {
  request(config: AxiosRequestConfig): Promise<AxiosResponse>
}

export default class HttpClient implements HttpClientInterface {
  BASE: string

  constructor(baseUrl: string) {
    this.BASE = baseUrl
  }

  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      axios({
        baseURL: this.BASE,
        ...config
      }).then(resolve)
        .catch(reject)
    })
  }
}

export {
  HttpClientInterface
}