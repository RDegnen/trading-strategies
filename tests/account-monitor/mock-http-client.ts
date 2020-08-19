import { IHttpClient } from '../../src/lib/data-sources/interfaces'

export default class MockHttpClient implements IHttpClient<any> {
  request(): Promise<any> {
    return new Promise(resolve => {
      resolve('nothing')
    })
  }

  keyRequest(): Promise<any> {
    return new Promise(resolve => {
      resolve({ data: { listenKey: 'mockListenKey' }})
    })
  }

  signedRequest(): Promise<any> {
    return new Promise(resolve => {
      resolve('nothing')
    })
  }
}