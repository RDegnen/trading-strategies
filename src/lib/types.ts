interface GenericUpdateEvent {
  e: string
}

export interface ISubject<O, E> {
  attach(o: O, eventType: string): void
  notifyObservers(e: E): void
}

export interface IObserver<E> {
  update(data: E): void
}

export interface IAccountUpdateEvent extends GenericUpdateEvent {}

export interface IBookUpdateEvent extends GenericUpdateEvent {}

export enum AccountEventTypes {
  ORDER = 'Order',
  ACCOUNT = 'Account'
}