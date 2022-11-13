import _ from '../../lib/fp';
import Observer from '../../lib/Observer';
import {
  add, bValue, makePercentage, subtract,
} from '../../lib/fp/util';

export class CPUInfo extends Observer {
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

  constructor(arr) {
    super();

    this.data = arr;
    this.interval = null;
  }

  value() {
    return this.target;
  }

  startInterval(time = 500) {
    this.interval = setInterval(() => {
      _.go(
        window.api.cpu(),
        info => this.data.push(info),
        _ => this.notify('interval', this),
      );
    }, time);
  }

  getUsagePercentage() {
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
}

const getCPUInfoFactory = (arr = []) => {
  let instance = null;

  return () => {
    instance ??= new CPUInfo(arr);

    return instance;
  };
};

const getCPUInfo = getCPUInfoFactory();

export default getCPUInfo;
