import _ from '../../lib/fp';
import { makePercentage } from '../../lib/fp/util';
import Observer from '../../lib/Observer';

export class MemoryInfo extends Observer {
  constructor(arr) {
    super();

    this.data = arr;
    this.interval = null;
  }

  value() {
    return this.target;
  }

  startInterval(time = 500) {
    if (this.interval) {
      return;
    }

    this.interval = setInterval(() => {
      _.go(
        window.api.memory(),
        info => this.data.push(info),
        _ => this.notify('interval', this),
      );
    }, time);
  }

  getUsagePercentage() {
    const { free, total } = this.data.slice(-1)[0];

    const percentage = 1 - free / total;

    return makePercentage(2, percentage);
  }
}

const getMemoryInfoFactory = (arr = []) => {
  let instance = null;

  return () => {
    instance ??= new MemoryInfo(arr);

    return instance;
  };
};

const getMemoryInfo = getMemoryInfoFactory();

export default getMemoryInfo;
