import { ILocalOrderBook } from "../../../../src/lib/local-order-book";
import { ISubject, IObserver, IBookUpdateEvent } from "../../../../src/lib/types/types";

export type bookType = ILocalOrderBook & ISubject<IObserver<IBookUpdateEvent>, IBookUpdateEvent>