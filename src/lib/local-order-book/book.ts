export default class Book {
  lastUpdateId: number
  sides: {
    [k: string]: string[][]
    bids: string[][]
    asks: string[][]
  }

  constructor(
    lastUpdateId: number,
    bids: string[][],
    asks: string[][]
  ) {
    this.lastUpdateId = lastUpdateId
    this.sides = {
      bids,
      asks
    }
  }

  removePrice(side: string, idx: number) {
    this.sides[side].splice(idx, 1)
  }

  updateSide(
    side: string,
    idx: number,
    removeOrUpdate: number,
    update: string[]
  ) {
    this.sides[side].splice(idx, removeOrUpdate, update)
  }
}