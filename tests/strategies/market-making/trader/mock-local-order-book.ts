import { ILocalOrderBook } from "../../../../src/lib/local-order-book";
import Book from "../../../../src/lib/local-order-book/book";

export default class MockLocalOrderBook implements ILocalOrderBook {
  book: Book

  constructor() {
    this.book = new Book(
      1,
      [
        [ '0.00100900', '70825.00000000' ],
        [ '0.00100800', '18495.00000000' ],
        [ '0.00100700', '58538.00000000' ],
        [ '0.00100600', '26726.00000000' ]
      ],
      [
        [ '0.00101000', '11648.00000000' ],
        [ '0.00102000', '70815.00000000' ],
        [ '0.00103000', '28209.00000000' ],
        [ '0.00104000', '22913.00000000' ]
      ]
    )
  }
}