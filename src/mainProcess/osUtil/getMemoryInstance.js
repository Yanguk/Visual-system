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

      // toDo: 추후 데이터 저장 로직 작업시 변경 필요
      if (this.data.length === 60) {
        this.data = this.data.slice(-2);
      }

      this.notify('interval', this);
    }, time);
  }

  getUsagePercentage() {
    const { free, total } = this.data.slice(-1)[0];

    // todo: 수정필요
    const percentage = 1 - free / total;

    return makePercentage(2, percentage);
  }
}

const getMemoryInstance = makeSingleTonFactory(MemoryInfo);

export default getMemoryInstance;
