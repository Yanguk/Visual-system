/* eslint-disable no-console */
import { exec } from 'node:child_process';
import util from 'node:util';
import { COMMAND } from '../../lib/constant';
import _ from '../../lib/fp';
import { identity, trimAndMakeArr } from '../../lib/fp/util';
import makeSingleTonFactory from '../../lib/makeSingleTonFactory';
import Observer from '../../lib/Observer';

const asyncExec = util.promisify(exec);

const getProcessList = async cmd => {
  const { stdout, stderr } = await asyncExec(cmd);

  if (stderr) {
    console.error(stderr);

    return stderr;
  }

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
    this.topTenData = [];
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
    try {
      if (!pid) {
        return { ok: false, message: 'undefined pid' };
      }

      const { stdout, stderr } = await asyncExec(`kill process ${pid}`);

      const message = stderr ?? stdout;
      const ok = !message.includes('failed');

      return { ok, message };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  }

  startInterval(time = 1000) {
    this.interval = setInterval(async () => {
      const data = await ProcessInfo.getProcessList(10);
      this.topTenData.push(data);

      this.notify('interval', this);
      // toDo: 추후 데이터 저장 로직 작업시 변경 필요
      if (this.topTenData.length === 60) {
        this.data = this.data.slice(-2);
      }
    }, time);
  }

  removeInterval() {
    clearInterval(this.interval);
  }

  getTopTenData() {
    return this.topTenData[this.topTenData.length - 1];
  }
}

const getProcessListInstance = makeSingleTonFactory(ProcessInfo);

export default getProcessListInstance;
