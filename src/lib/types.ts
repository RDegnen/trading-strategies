export interface IAccountSubject {
  attach(o: IAccountObserver, eventType: string): void
  notifyObservers(e: IAccountUpdateEvent): void
}

export interface IAccountUpdateEvent {
  e: string
}

export interface IAccountObserver {
  update(data: IAccountUpdateEvent): void
}