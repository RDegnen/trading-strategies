import { IObserver, IAccountUpdateEvent } from "../../src/lib/types/types";

export class TestOrderObserver implements IObserver<IAccountUpdateEvent> {
  updateHasBeenCalled: boolean = false
  update(event: IAccountUpdateEvent) {
    this.updateHasBeenCalled = true
  }
}

export class TestAccountObserver implements IObserver<IAccountUpdateEvent> {
  updateHasBeenCalled: boolean = false
  update(event: IAccountUpdateEvent) {
    this.updateHasBeenCalled = true
  }
}