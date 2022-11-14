import { execIdentity } from "./fp/util";

export default class Observer {
  constructor() {
    this._observers = new Map();
  };

  on(eventName, ...rest) {
    const targetList = this._observers.get(eventName);
    const isHave = !!targetList;
    const list = targetList ?? [];

    for (const event of rest) {
      list.push(event);
    }

    if (!isHave) {
      this._observers.set(eventName, list);
    }
  };

  removeListener(eventName, fnName) {
    const list = this._observers.get(eventName) ?? [];
    const targetIndex = list.indexOf(fnName);

    if (targetIndex === -1) {
      return;
    }

    list.splice(targetIndex, 1);
  }

  notify(eventName, item) {
    const list = this._observers.get(eventName) ?? [];

    list.forEach(execIdentity(item));
  }
}
