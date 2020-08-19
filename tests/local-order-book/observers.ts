import { IObserver, IBookUpdateEvent } from '../../src/lib/types/types'

export class TestObserver implements IObserver<IBookUpdateEvent> {
  updateHasBeenCalled: boolean = false
  update(event: IBookUpdateEvent) {
    this.updateHasBeenCalled = true
  }
}