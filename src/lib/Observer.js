import { execIdentity, push } from './fp/util';
import _ from './fp/underDash';

export default class Observer {
  constructor() {
    this._observers = new Map();
  }

  on(eventName, ...rest) {
    const targetList = this._observers.get(eventName);
    const isHave = !!targetList;
    const list = targetList ?? [];

    _.each(push(list), rest);

    if (!isHave) {
      this._observers.set(eventName, list);
    }
  }

  removeListener(eventName, fnName) {
    const list = this._observers.get(eventName) ?? [];
    const targetIndex = list.indexOf(fnName);

    if (targetIndex === -1) {
      return;
    }

    list.splice(targetIndex, 1);
  }

  notify(eventName, item) {
    _.each(execIdentity(item), this._observers.get(eventName) ?? []);
  }
}
