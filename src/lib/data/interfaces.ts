import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface HttpClientInterface {
  request(config: AxiosRequestConfig): Promise<AxiosResponse>
  privateRequest(config: AxiosRequestConfig): Promise<AxiosResponse>
}