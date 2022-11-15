import os from 'os';
import _ from '../../lib/fp';
import L from '../../lib/fp/lazy';
import {
  add, bValue, makePercentage, subtract,
} from '../../lib/fp/util';
import makeSingleTonFactory from '../../lib/makeSingleTonFactory';
import Observer from '../../lib/Observer';

export class CPUInfo extends Observer {
  constructor(window) {
    super();

    this.window = window;
    this.data = [os.cpus()];
    this.interval = null;
    this.count = this.data[0].length;
  }

  static getCPUTotal(cpus) {
    let idleSum = 0;

    const addIdle = _.pipe(
      bValue('idle'),
      idle => { idleSum += idle; },
    );

    const total = _.go(
      cpus,
      _.map(bValue('times')),
      _.each(addIdle),
      _.map(Object.values),
      _.map(_.reduce(add)),
      _.reduce(add),
    );

    return {
      idleSum,
      total,
    };
  }

  startInterval(time = 1000) {
    this.interval = setInterval(async () => {
      const info = os.cpus();

      this.data.push(info);

      this.notify('interval', this);

      // toDo: 추후 데이터 저장 로직 작업시 변경 필요
      if (this.data.length === 60) {
        this.data = this.data.slice(-2);
      }
    }, time);
  }

  removeInterval() {
    clearInterval(this.interval);
  }

  getTotalUsagePercentage() {
    if (this.data.length < 2) {
      return 0;
    }

    const [preCpu, curCpu] = this.data.slice(-2);

    const pre = CPUInfo.getCPUTotal(preCpu);
    const cur = CPUInfo.getCPUTotal(curCpu);

    const cpuIter = [cur, pre];

    const idle = _.go(
      cpuIter,
      _.map(bValue('idleSum')),
      _.reduce(subtract),
    );

    const total = _.go(
      cpuIter,
      _.map(bValue('total')),
      _.reduce(subtract),
    );

    const percentage = 1 - idle / total;

    return makePercentage(2, percentage);
  }

  getAllUsagePercentage() {
    const [preCpu, curCpu] = this.data.slice(-2);

    const pre = _.go(
      preCpu,
      _.map(cpu => CPUInfo.getCPUTotal([cpu])),
    );

    const cur = _.go(
      curCpu,
      _.map(cpu => CPUInfo.getCPUTotal([cpu])),
    );

    const result = _.go(
      L.range(pre.length),
      L.map(index => {
        const idle = cur[index].idleSum - pre[index].idleSum;
        const total = cur[index].total - pre[index].total;
        const percentage = 1 - idle / total;

        return makePercentage(2, percentage);
      }),
      _.takeAll,
    );

    return result;
  }
}

const getCPUInstance = makeSingleTonFactory(CPUInfo);

export default getCPUInstance;
