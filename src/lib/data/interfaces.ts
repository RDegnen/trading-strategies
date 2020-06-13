import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IHttpClient<T = AxiosResponse> {
  request(config: AxiosRequestConfig): Promise<T>
  keyRequest(config: AxiosRequestConfig): Promise<T>
  signedRequest(config: AxiosRequestConfig): Promise<T>
}

export interface IWebSocketClient {
  onMessage(cb: Function): void
}