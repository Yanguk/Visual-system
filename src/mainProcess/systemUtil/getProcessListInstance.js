import { COMMAND } from '../../lib/constant';
import _ from '../../lib/fp';
import { identity, trimAndMakeArr } from '../../lib/fp/util';
import makeSingleTonFactory from '../../lib/makeSingleTonFactory';
import Observer from '../../lib/Observer';
import customExec from '../osUtil/customExec';

const getProcessList = async cmd => {
  const stdout = await customExec(cmd);

  const list = _.go(
    stdout,
    str => str.split('\n'),
    _.map(trimAndMakeArr),
    _.map(_.filter(identity)),
    _.map(([a, b, c, d, e, ...f]) => [f.join(' ').split('/').slice(-1)[0], a, b, c, d, e]),
  );

  list.pop();

  return list;
};

export class ProcessInfo extends Observer {
  constructor(window) {
    super();

    this.window = window;
    this.data = [];
    this.interval = null;
  }

  static async getProcessList(
    limit = -1,
    sort = COMMAND.PROCESS_LIST.SORT_CPU,
  ) {
    const cmdObj = {
      [COMMAND.PROCESS_LIST.SORT_CPU]: 'ps -e -o pid,pcpu,pmem,rss,time,comm -r',
      [COMMAND.PROCESS_LIST.SORT_MEMORY]: 'ps -e -o pid,pcpu,pmem,rss,time,comm -m',
    };

    const selectedCmd = cmdObj[sort];

    const cmd = limit > -1 ? `${selectedCmd} | head -${limit}` : selectedCmd;

    return getProcessList(cmd);
  }

  static async killProcess(pid) {
    if (!pid) {
      return { ok: false, message: 'undefined pid' };
    }

    const message = await customExec(`kill process ${pid}`);
    const ok = !message.includes('failed');

    return { ok, message };
  }

  startInterval(time = 1000) {
    this.interval = setInterval(async () => {
      const data = await ProcessInfo.getProcessList(100);
      this.data.push(data);

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

  async getLatestData(count = Infinity) {
    const latestData = this.data[this.data.length - 1].slice(0, count);

    if (latestData.length === 0) {
      const data = await ProcessInfo.getProcessList(100, 'cpu');

      return data;
    }

    return latestData;
  }
}

const getProcessListInstance = makeSingleTonFactory(ProcessInfo);

export default getProcessListInstance;
