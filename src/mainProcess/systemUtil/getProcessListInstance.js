import { COMMAND } from '../../lib/constant';
import _ from '../../lib/fp';
import L from '../../lib/fp/lazy';
import { trimAndMakeArr } from '../../lib/fp/util';
import makeSingleTonFactory from '../../lib/makeSingleTonFactory';
import Observer from '../../lib/Observer';

const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const getProcessList = async cmd => {
  const { stdout, stderr } = await exec(cmd);

  if (stderr) {
    // eslint-disable-next-line no-console
    console.error(stderr);

    return stderr;
  }

  const list = _.go(
    stdout,
    str => str.split('\n'),
    L.map(str => {
      const arr = trimAndMakeArr(str);
      const pre = arr.slice(0, 6);
      const after = arr.slice(6);
      pre.push(after.join(' '));

      return pre;
    }),
    L.filter(item => item.length > 6),
    _.takeAll,
  );

  return list;
};

export class ProcessInfo extends Observer {
  constructor(window) {
    super();

    this.window = window;
    this.data = [];
    this.interval = null;
  }

  startInterval(time = 1000) {
    this.interval = setInterval(async () => {
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

  static async getProcessList(option = {
    sort: COMMAND.PROCESS_LIST.SORT_CPU,
    limit: -1,
  }) {
    const cmdObj = {
      [COMMAND.PROCESS_LIST.SORT_CPU]: 'ps -e -o user,pid,pcpu,pmem,rss,time,comm -r',
      [COMMAND.PROCESS_LIST.SORT_MEMORY]: 'ps -e -o user,pid,pcpu,pmem,rss,time,comm -m',
    };

    const selectedCmd = cmdObj[option.sort];

    const cmd = option.limit > -1 ? `${selectedCmd} | head -${option.limit}` : selectedCmd;

    return getProcessList(cmd);
  }

  static async killProcess(pid) {
    const { stderr } = await exec(COMMAND.PROCESS_LIST);

    if (stderr) {
      // eslint-disable-next-line no-console
      console.error(stderr);

      return stderr;
    }

    return { ok: true, message: 'success' };
  }
}

const getProcessListInstance = makeSingleTonFactory(ProcessInfo);

export default getProcessListInstance;
