import { IAccountObserver, IAccountUpdateEvent } from "../../src/lib/types";

export class TestOrderObserver implements IAccountObserver {
  updateHasBeenCalled: boolean = false
  update(event: IAccountUpdateEvent) {
    this.updateHasBeenCalled = true
  }
}

export class TestAccountObserver implements IAccountObserver {
  updateHasBeenCalled: boolean = false
  update(event: IAccountUpdateEvent) {
    this.updateHasBeenCalled = true
  }
}