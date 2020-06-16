import { ILocalOrderBook } from "../../../../src/lib/local-order-book";
import Book from "../../../../src/lib/local-order-book/book";

export default class MockLocalOrderBook implements ILocalOrderBook {
  book: Book

  constructor() {
    this.book = new Book(
      1,
      [
        [ '0.010', '70825.00000000' ],
        [ '0.009', '18495.00000000' ],
        [ '0.008', '58538.00000000' ],
        [ '0.007', '26726.00000000' ]
      ],
      [
        [ '0.013', '11648.00000000' ],
        [ '0.014', '70815.00000000' ],
        [ '0.015', '28209.00000000' ],
        [ '0.016', '22913.00000000' ]
      ]
    )
  }
}