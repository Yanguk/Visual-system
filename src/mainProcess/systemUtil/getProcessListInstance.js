import { identity, trimAndMakeArr } from '../../lib/fp/util';
import makeSingleTonFactory from '../../lib/makeSingleTonFactory';
import customExec from '../osUtil/customExec';
import { COMMAND } from '../../lib/constant';
import Observer from '../../lib/Observer';
import _ from '../../lib/fp/underDash';

const processingListData = async cmd => {
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

    return processingListData(cmd);
  }

  static async killProcess(pid) {
    try {
      if (!pid) {
        return { ok: false, message: 'undefined pid' };
      }

      const message = await customExec(`kill process ${pid}`);

      return { ok: true, message };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  }

  startInterval(time = 1000) {
    this.interval = setInterval(async () => {
      this.data = await ProcessInfo.getProcessList(100);

      this.notify('interval', this);
    }, time);
  }

  removeInterval() {
    clearInterval(this.interval);
  }
}

const getProcessListInstance = makeSingleTonFactory(ProcessInfo);

export default getProcessListInstance;
