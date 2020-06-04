export interface IOrderBook {
  lastUpdateId: number,
  bids: string[][],
  asks: string[][],
}

export default class Book implements IOrderBook {
  lastUpdateId: number
  bids: string[][]
  asks: string[][]

  constructor(
    lastUpdateId: number,
    bids: string[][],
    asks: string[][]
  ) {
    this.lastUpdateId = lastUpdateId
    this.bids = bids
    this.asks = asks
  }

  getSide(side: string): string[][] {
    if (side === 'bids') {
      return this.bids
    } else if (side === 'asks') {
      return this.asks
    }
    return []
  }

  removePrice(side: string, idx: number) {
    if (side === 'bids') {
      this.bids.splice(idx, 1)
    } else if (side === 'asks') {
      this.asks.splice(idx, 1)
    }
  }

  updateSide(side: string, idx: number, removeOrUpdate: number, update: string[]) {
    if (side === 'bids') {
      this.bids.splice(idx, removeOrUpdate, update)
    } else if (side === 'asks') {
      this.asks.splice(idx, removeOrUpdate, update)
    }
  }
}