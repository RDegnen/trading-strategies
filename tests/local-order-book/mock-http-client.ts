import { IHttpClient } from '../../src/lib/data/interfaces'

export default class MockHttpClient implements IHttpClient<any> {
  request(): Promise<any> {
    return new Promise((resolve) => {
      resolve({
        data: {
          lastUpdateId: 10,
          bids: [
            [ '10', '70825.00000000' ],
            [ '9', '18495.00000000' ],
            [ '8', '58538.00000000' ],
            [ '7', '26726.00000000' ]
          ],
          asks: [
            [ '11', '11648.00000000' ],
            [ '12', '70815.00000000' ],
            [ '13', '28209.00000000' ],
            [ '14', '22913.00000000' ]
          ]
        }
      })
    })
  }

  keyRequest(): Promise<any> {
    return new Promise(resolve => {
      resolve('nothing')
    })
  }

  signedRequest(): Promise<any> {
    return new Promise(resolve => {
      resolve('nothing')
    })
  }
}