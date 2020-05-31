import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IHttpClient {
  request(config: AxiosRequestConfig): Promise<AxiosResponse>
  privateRequest(config: AxiosRequestConfig): Promise<AxiosResponse>
}

export interface IWebSocketClient {
  onMessage(cb: Function): void
}