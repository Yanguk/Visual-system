import { exec } from 'node:child_process';
import util from 'node:util';
import os from 'os';
import _ from '../../lib/fp';
import L from '../../lib/fp/lazy';
import { makePercentage } from '../../lib/fp/util';
import makeSingleTonFactory from '../../lib/makeSingleTonFactory';
import Observer from '../../lib/Observer';

const asyncExec = util.promisify(exec);

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

  getFreePercentage() {
    if (this.data.length < 2) {
      return 0;
    }

    const { free, total } = this.data.slice(-1)[0];
    const percentage = free / total;

    return makePercentage(2, percentage);
  }

  static async getMemoryDetail() {
    const { stdout, stderr } = await asyncExec('vm_stat');

    if (stderr) {
      // eslint-disable-next-line no-console
      console.error(stderr);
      return {};
    }

    const info = _.go(
      stdout,
      str => str.split('\n'),
      _.map(str => str.split(':')),
      _.map(_.pipe(
        L.getIndex,
        _.map(([str, idx]) => (idx
          ? str.replace(/[\s\n\r\\.]+/g, '')
          : str.replace(/[\s\n\r]+/g, '_'))),
      )),
    );

    info.pop();

    const infoObj = _.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {}, info.slice(1));

    return infoObj;
  }
}

const getMemoryInstance = makeSingleTonFactory(MemoryInfo);

export default getMemoryInstance;
