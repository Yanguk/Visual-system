import os from 'os';
import { makePercentage } from '../../lib/fp/util';
import makeSingleTonFactory from '../../lib/makeSingleTonFactory';
import Observer from '../../lib/Observer';

export class MemoryInfo extends Observer {
  constructor(window) {
    super();

    this.window = window;
    this.data = [];
    this.interval = null;
  }

  startInterval(time = 500) {
    if (this.interval) {
      return;
    }

    this.interval = setInterval(() => {
      const memoryInfo = {
        free: os.freemem(),
        total: os.totalmem(),
      };

      this.data.push(memoryInfo);

      this.notify('interval', this);
    }, time);
  }

  getUsagePercentage() {
    const { free, total } = this.data.slice(-1)[0];

    const percentage = 1 - free / total;

    return makePercentage(2, percentage);
  }
}

const getMemoryInfo = makeSingleTonFactory(MemoryInfo);

export default getMemoryInfo;
