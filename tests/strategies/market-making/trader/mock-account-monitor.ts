import { IAccountSubject } from '../../../../src/lib/types'

export default class MockAccountMonitor implements IAccountSubject {
  attach() {}
  notifyObservers() {}
}