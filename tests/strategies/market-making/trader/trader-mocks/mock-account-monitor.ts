import { ISubject, IObserver, IAccountUpdateEvent } from '../../../../../src/lib/types/types'

export default class MockAccountMonitor 
  implements ISubject<IObserver<IAccountUpdateEvent>, IAccountUpdateEvent> {
    attach() {}
    notifyObservers() {}
  }